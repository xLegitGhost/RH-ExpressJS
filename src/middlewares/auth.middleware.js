const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers['authorization'];

  if (!bearerHeader) {
    return res.status(403).json({ error: 'Se requiere un token de autenticación.' });
  }

  const token = bearerHeader.split(' ')[1];

  if (!token) {
    return res.status(403).json({ error: 'Token mal formado.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Guardar los datos del usuario en req para su uso posterior
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado.' });
  }
};

module.exports = verifyToken;
