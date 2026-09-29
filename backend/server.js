const express = require('express');
const cors = require('cors');
require('dotenv').config();

const supabase = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend funcionando con Supabase' });
});

// Ruta de productos
app.get('/api/productos', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('Error al consultar Supabase:', error.message);
      return res.status(500).json({ 
        error: 'Error al consultar la base de datos',
        mensaje: error.message 
      });
    }

    res.json(data);
  } catch (err) {
    console.error('Error del servidor:', err.message);
    res.status(500).json({ error: 'Error del servidor', mensaje: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
});