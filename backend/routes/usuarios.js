import express from 'express';
import pool from '../db.js';

const router = express.Router();

const validRoles = ['admin', 'mesero', 'usuario'];

// Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name, role FROM users');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
});

// Crear usuario
router.post('/', async (req, res) => {
  const { name, pin, role } = req.body;

  if (!name || !pin || !role) {
    return res.status(400).json({ message: 'Faltan campos obligatorios' });
  }

  if (!validRoles.includes(role)) {
    return res.status(400).json({ message: 'Rol inválido' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO users (name, pin, role) VALUES (?, ?, ?)',
      [name, pin, role]
    );
    res.status(201).json({ id: result.insertId, name, role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear usuario' });
  }
});

// Actualizar usuario
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, pin, role } = req.body;

  if (!name || !pin || !role) {
    return res.status(400).json({ message: 'Faltan campos obligatorios' });
  }

  if (!validRoles.includes(role)) {
    return res.status(400).json({ message: 'Rol inválido' });
  }

  try {
    const [result] = await pool.query(
      'UPDATE users SET name = ?, pin = ?, role = ? WHERE id = ?',
      [name, pin, role, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ id: Number(id), name, role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar usuario' });
  }
});

// Eliminar usuario
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar usuario' });
  }
});

export default router;
