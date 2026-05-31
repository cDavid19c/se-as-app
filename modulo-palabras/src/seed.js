const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Usuario = require('./models/Usuario');
require('dotenv').config();

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);

  // Buscar el profesor David
  const profesor = await Usuario.findOne({ nombre: 'David' });
  if (!profesor) {
    console.log('Primero crea el usuario David');
    process.exit(1);
  }

  const pin_hash = await bcrypt.hash('5678', 10);

  await Usuario.create({
    nombre: 'Juan',
    rol: 'alumno',
    avatar_id: 'avatar1',
    pin_hash,
    profesor_id: profesor._id
  });

  console.log('Alumno creado: Juan / PIN: 5678');
  process.exit(0);
}

seed().catch(console.error);