 const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Login profesor (email + password en el futuro, por ahora nombre + pin)
router.post('/login', async (req, res) => {
  try {
    const { nombre, pin } = req.body;

    const usuario = await Usuario.findOne({ nombre, deletedAt: null });
    if (!usuario) return res.status(401).json({ error: 'Usuario no encontrado' });

    const pinValido = await bcrypt.compare(pin, usuario.pin_hash);
    if (!pinValido) return res.status(401).json({ error: 'PIN incorrecto' });

    const token = jwt.sign(
      {
        sub: usuario._id,
        rol: usuario.rol,
        nombre: usuario.nombre,
        profesor_id: usuario.profesor_id
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.cookie('auth_token', token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 8 * 60 * 60 * 1000
    });

    res.json({ ok: true, rol: usuario.rol });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login visual alumno (avatar + pin)
router.post('/login-alumno', async (req, res) => {
  try {
    const { avatar_id, pin, profesor_id } = req.body;

    const alumno = await Usuario.findOne({
      avatar_id,
      profesor_id,
      rol: 'alumno',
      deletedAt: null
    });
    if (!alumno) return res.status(401).json({ error: 'Alumno no encontrado' });

    const pinValido = await bcrypt.compare(pin, alumno.pin_hash);
    if (!pinValido) return res.status(401).json({ error: 'PIN incorrecto' });

    const token = jwt.sign(
      {
        sub: alumno._id,
        rol: alumno.rol,
        nombre: alumno.nombre,
        profesor_id: alumno.profesor_id
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.cookie('auth_token', token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 8 * 60 * 60 * 1000
    });

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Me — hidrata el estado del usuario en React
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.user.sub).select('-pin_hash');
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('auth_token');
  res.json({ ok: true });
});

module.exports = router;
