const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const employeeRoutes = require('./routes/employees.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Archivos publicos (Frontend)
app.use(express.static(path.join(__dirname, '../public')));

// Rutas API
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);

// Fallback para rutas no encontradas
app.use((req, res, next) => {
  // Si la ruta empieza con /api/, devolvemos un 404 en formato JSON
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Ruta API no encontrada' });
  }
  // Para cualquier otra ruta, servimos el index.html
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
