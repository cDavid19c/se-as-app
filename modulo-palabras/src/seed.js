const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Usuario = require('./models/Usuario');
require('dotenv').config();

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const pin_hash = await bcrypt.hash('1234', 10);
  
  await Usuario.create({
    nombre: 'David',
    rol: 'profesor',
    pin_hash
  });

  console.log('Usuario creado: David / PIN: 1234');
  process.exit(0);
}

seed().catch(console.error); 
