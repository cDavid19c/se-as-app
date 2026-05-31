 const express = require('express');
const Progreso = require('../models/Progreso');
const Flashcard = require('../models/Flashcard');
const Nivel = require('../models/Nivel');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Calcular SM-2
function calcularSM2(progreso, calificacion, tipoJuego) {
  const PESO = { flashcards: 1.0, memoria: 0.7, unir: 0.8 };
  const scoreAjustado = Math.round(calificacion * (PESO[tipoJuego] || 1.0));

  let { intervalo, easiness_factor, repeticiones } = progreso;

  if (scoreAjustado < 3) {
    intervalo = 1;
    repeticiones = 0;
  } else {
    if (repeticiones === 0) intervalo = 1;
    else if (repeticiones === 1) intervalo = 6;
    else intervalo = Math.round(intervalo * easiness_factor);

    easiness_factor = Math.max(
      1.3,
      easiness_factor + 0.1 - (5 - scoreAjustado) * (0.08 + (5 - scoreAjustado) * 0.02)
    );
    repeticiones += 1;
  }

  const proximo_repaso = new Date();
  proximo_repaso.setDate(proximo_repaso.getDate() + intervalo);

  return { intervalo, easiness_factor, repeticiones, proximo_repaso };
}

// Sesión diaria
router.get('/sesion', authMiddleware, async (req, res) => {
  try {
    const usuario_id = req.user.sub;
    const { nivel_id } = req.query;

    // Obtener config del nivel
    const nivel = await Nivel.findById(nivel_id);
    const max_repasos = nivel?.config?.max_repasos_diarios || 20;
    const max_nuevas = nivel?.config?.max_tarjetas_nuevas || 5;

    // Repasos pendientes
    const repasos = await Progreso.find({
      usuario_id,
      proximo_repaso: { $lte: new Date() }
    }).limit(max_repasos).populate('flashcard_id');

    // Flashcards nuevas
    const idsConProgreso = await Progreso.distinct('flashcard_id', { usuario_id });
    const nuevas = await Flashcard.find({
      nivel_id,
      _id: { $nin: idsConProgreso },
      deletedAt: null
    }).limit(max_nuevas);

    // Mezclar
    const repasosMapeados = repasos.map(r => ({ ...r.flashcard_id.toObject(), es_repaso: true }));
    const nuevasMapeadas = nuevas.map(f => ({ ...f.toObject(), es_repaso: false }));
    const sesion = [...repasosMapeados, ...nuevasMapeadas].sort(() => Math.random() - 0.5);

    res.json(sesion);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Evaluar flashcard
router.post('/evaluar', authMiddleware, async (req, res) => {
  try {
    const { flashcard_id, calificacion, tipoJuego = 'flashcards' } = req.body;
    const usuario_id = req.user.sub;

    let progreso = await Progreso.findOne({ usuario_id, flashcard_id });

    if (!progreso) {
      progreso = new Progreso({ usuario_id, flashcard_id });
    }

    const resultado = calcularSM2(progreso, calificacion, tipoJuego);
    progreso.intervalo = resultado.intervalo;
    progreso.easiness_factor = resultado.easiness_factor;
    progreso.repeticiones = resultado.repeticiones;
    progreso.proximo_repaso = resultado.proximo_repaso;
    progreso.ultima_respuesta = new Date();
    progreso.ultima_fuente = tipoJuego;

    await progreso.save();
    res.json(progreso);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
