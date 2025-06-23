import express from 'express';
import pool from '../db.js';


const router = express.Router();

// Obtener productos
router.get('/', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM productos');
  res.json(rows);
});

// Agregar nuevo producto
router.post('/', async (req, res) => {
  const { nombre, precio, categoria_id } = req.body;
  const [result] = await pool.query(
    'INSERT INTO productos (nombre, precio, categoria_id) VALUES (?, ?, ?)',
    [nombre, precio, categoria_id || null]
  );
  res.json({ id: result.insertId, nombre, precio, categoria_id });
});

// Cambiar visibilidad (técnicamente en tu BD no hay un campo `visible`, así que lo agregamos)
router.patch('/:id/visible', async (req, res) => {
  const { visible } = req.body;
  const { id } = req.params;

  await pool.query('UPDATE productos SET visible = ? WHERE id = ?', [
    visible ? 1 : 0,
    id,
  ]);
  res.json({ id, visible });
});

// Obtener solo productos visibles
// ✅ CORRECTA DEFINICIÓN
router.get('/visibles', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM productos WHERE visible = 1');
    res.json(rows);
  } catch (err) {
    console.error('Error en /api/productos/visibles:', err);
    res.status(500).json({ error: 'Error al obtener productos visibles' });
  }
});


export default router;
