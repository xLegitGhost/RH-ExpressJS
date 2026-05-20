const supabase = require('../config/supabase');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Por favor ingresa usuario y contraseña.' });
  }

  try {
    // Buscar usuario en Supabase (tabla 'users')
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username);

    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al consultar la base de datos.' });
    }

    if (!users || users.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    const user = users[0];

    // Verificar contraseña (se asume que están hasheadas con bcrypt en la BD, 
    // pero si el admin las pone en texto plano por ahora lo manejamos también por seguridad de la prueba)
    // Para simplificar la prueba y si la insertas manual a mano en Supabase sin hash:
    let isMatch = false;
    
    // Check if it's hashed by checking its length (bcrypt hashes are typically 60 chars long)
    if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
        isMatch = await bcrypt.compare(password, user.password);
    } else {
        // Fallback for plain text passwords inserted manually in Supabase GUI for testing
        isMatch = (password === user.password);
    }

    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    // Crear y firmar el JWT
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        id: user.id,
        username: user.username
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el servidor.' });
  }
};

module.exports = {
  login
};
