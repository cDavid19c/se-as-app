 const express = require('express');
const Nivel = require('../models/Nivel');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Obtener niveles (opcionalmente filtrar por categoría)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const filtro = { deletedAt: null };
    if (req.query.categoria_id) filtro.categoria_id = req.query.categoria_id;
    const niveles = await Nivel.find(filtro).sort({ orden: 1 });
    res.json(niveles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear nivel
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { nombre, orden, categoria_id, config } = req.body;
    const nivel = await Nivel.create({ nombre, orden, categoria_id, config });
    res.status(201).json(nivel);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Editar nivel
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { nombre, orden, config } = req.body;
    const nivel = await Nivel.findByIdAndUpdate(
      req.params.id,
      { nombre, orden, config },
      { new: true }
    );
    res.json(nivel);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reordenar niveles (drag & drop)
router.put('/reordenar/lote', authMiddleware, async (req, res) => {
  try {
    const { orden } = req.body; // [{ id, orden }, { id, orden }, ...]
    await Nivel.bulkWrite(
      orden.map(({ id, orden }) => ({
        updateOne: {
          filter: { _id: id },
          update: { $set: { orden } }
        }
      }))
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Borrar nivel (soft delete)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Nivel.findByIdAndUpdate(req.params.id, { deletedAt: new Date() });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
