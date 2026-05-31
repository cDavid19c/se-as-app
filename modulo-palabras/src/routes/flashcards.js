const express = require('express');
const Flashcard = require('../models/Flashcard');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Obtener flashcards (filtrar por categoría, nivel o palabra)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const filtro = { deletedAt: null };
    if (req.query.categoria_id) filtro.categoria_id = req.query.categoria_id;
    if (req.query.nivel_id) filtro.nivel_id = req.query.nivel_id;
    if (req.query.palabra) filtro.palabra = { $regex: req.query.palabra, $options: 'i' };
    const flashcards = await Flashcard.find(filtro)
      .populate('categoria_id', 'nombre')
      .populate('nivel_id', 'nombre');
    res.json(flashcards);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener una flashcard por id
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const flashcard = await Flashcard.findById(req.params.id)
      .populate('categoria_id', 'nombre')
      .populate('nivel_id', 'nombre');
    if (!flashcard || flashcard.deletedAt) {
      return res.status(404).json({ error: 'Flashcard no encontrada' });
    }
    res.json(flashcard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear flashcard
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { palabra, descripcion, imagen_url, video_url, categoria_id, nivel_id } = req.body;
    const flashcard = await Flashcard.create({
      palabra, descripcion, imagen_url, video_url,
      categoria_id, nivel_id,
      creado_por: req.user.sub
    });
    res.status(201).json(flashcard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Editar flashcard
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { palabra, descripcion, imagen_url, video_url, categoria_id, nivel_id } = req.body;
    const flashcard = await Flashcard.findByIdAndUpdate(
      req.params.id,
      { palabra, descripcion, imagen_url, video_url, categoria_id, nivel_id },
      { new: true }
    );
    res.json(flashcard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Borrar flashcard (soft delete)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Flashcard.findByIdAndUpdate(req.params.id, { deletedAt: new Date() });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 
