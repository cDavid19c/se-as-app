 const express = require('express');
const Categoria = require('../models/Categoria');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Obtener todas las categorías
router.get('/', authMiddleware, async (req, res) => {
  try {
    const categorias = await Categoria.find({ deletedAt: null });
    res.json(categorias);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear categoría
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { nombre, icono, descripcion } = req.body;
    const categoria = await Categoria.create({ nombre, icono, descripcion });
    res.status(201).json(categoria);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Editar categoría
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { nombre, icono, descripcion } = req.body;
    const categoria = await Categoria.findByIdAndUpdate(
      req.params.id,
      { nombre, icono, descripcion },
      { new: true }
    );
    res.json(categoria);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Borrar categoría (soft delete)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Categoria.findByIdAndUpdate(req.params.id, { deletedAt: new Date() });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
