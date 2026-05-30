 const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  rol: { type: String, enum: ['superadmin', 'profesor', 'alumno'], required: true },
  avatar_id: { type: String },
  pin_hash: { type: String },
  profesor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  creado_por: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  deletedAt: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Usuario', usuarioSchema);
