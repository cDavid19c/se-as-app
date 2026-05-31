 const express = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

const PINES_INVALIDOS = ['1234', '0000', '1111', '2222', '3333', '4444', '5555', '6666', '7777', '8888', '9999'];

function generarPin() {
  let pin;
  do {
    pin = Math.floor(1000 + Math.random() * 9000).toString();
  } while (PINES_INVALIDOS.includes(pin));
  return pin;
}

// Obtener alumnos del profesor
router.get('/', authMiddleware, async (req, res) => {
  try {
    const alumnos = await Usuario.find({
      profesor_id: req.user.sub,
      rol: 'alumno',
      deletedAt: null
    }).select('-pin_hash');
    res.json(alumnos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear alumno
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { nombre, avatar_id } = req.body;
    const pin = generarPin();
    const pin_hash = await bcrypt.hash(pin, 10);

    const alumno = await Usuario.create({
      nombre,
      rol: 'alumno',
      avatar_id,
      pin_hash,
      profesor_id: req.user.sub,
      creado_por: req.user.sub
    });

    res.status(201).json({ alumno, pin });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Resetear PIN
router.post('/:id/reset-pin', authMiddleware, async (req, res) => {
  try {
    const pin = generarPin();
    const pin_hash = await bcrypt.hash(pin, 10);

    const alumno = await Usuario.findOneAndUpdate(
      { _id: req.params.id, profesor_id: req.user.sub },
      { pin_hash },
      { new: true }
    );

    if (!alumno) return res.status(404).json({ error: 'Alumno no encontrado' });

    res.json({ pin });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar alumno (soft delete)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Usuario.findOneAndUpdate(
      { _id: req.params.id, profesor_id: req.user.sub },
      { deletedAt: new Date() }
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
