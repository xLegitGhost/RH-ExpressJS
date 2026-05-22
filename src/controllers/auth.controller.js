import supabase from '../config/supabase.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Por favor ingresa usuario y contraseña.' });
  }

  try {
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

    let isMatch = false;
    if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
        isMatch = await bcrypt.compare(password, user.password);
    } else {
        isMatch = (password === user.password);
    }

    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

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
