import supabase from '../config/supabase.js';

export const getEmployees = async (req, res) => {
  const { search } = req.query;
  
  try {
    let query = supabase.from('employees').select('*').order('id', { ascending: false });

    if (search) {
      query = query.ilike('nombre', `%${search}%`);
    }

    const { data, error } = await query;

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener empleados', details: error.message });
  }
};

export const createEmployee = async (req, res) => {
  const { nombre, apellidos, telefono, correo, direccion } = req.body;

  if (!nombre || !apellidos || !correo) {
    return res.status(400).json({ error: 'Nombre, apellidos y correo son obligatorios.' });
  }

  try {
    const { data, error } = await supabase
      .from('employees')
      .insert([{ nombre, apellidos, telefono, correo, direccion }])
      .select();

    if (error) throw error;
    res.status(201).json({ message: 'Empleado creado exitosamente', employee: data[0] });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear empleado', details: error.message });
  }
};

export const updateEmployee = async (req, res) => {
  const { id } = req.params;
  const { nombre, apellidos, telefono, correo, direccion } = req.body;

  try {
    const { data, error } = await supabase
      .from('employees')
      .update({ nombre, apellidos, telefono, correo, direccion })
      .eq('id', id)
      .select();

    if (error) throw error;
    if (data.length === 0) return res.status(404).json({ error: 'Empleado no encontrado' });

    res.json({ message: 'Empleado actualizado', employee: data[0] });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar empleado', details: error.message });
  }
};

export const deleteEmployee = async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from('employees')
      .delete()
      .eq('id', id)
      .select();

    if (error) throw error;
    if (data.length === 0) return res.status(404).json({ error: 'Empleado no encontrado' });

    res.json({ message: 'Empleado eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar empleado', details: error.message });
  }
};
