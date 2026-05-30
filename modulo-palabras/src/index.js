 const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.error('Error MongoDB:', err));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', modulo: 'palabras' });
});

app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});
