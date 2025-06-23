// routes/mesas.js
import express from 'express';
import pool from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const [mesas] = await pool.query('SELECT * FROM mesas');
  res.json(mesas);
});

router.patch('/:id/estado', async (req, res) => {
  const { estado } = req.body;
  const { id } = req.params;
  await pool.query('UPDATE mesas SET estado = ? WHERE id = ?', [estado, id]);
  res.json({ success: true });
});

export default router;
