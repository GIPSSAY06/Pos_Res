import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Crear orden (pero solo si tiene productos)
router.post('/', async (req, res) => {
  const { mesa_id = null, productos = [], notas = '', monto_extra = 0 } = req.body;

  if (productos.length === 0) {
    return res.status(400).json({ error: 'No se pueden guardar órdenes vacías' });
  }

  try {
    // Crear orden
    const [resultado] = await pool.query(
      'INSERT INTO ordenes (mesa_id, notas, monto_extra, estado) VALUES (?, ?, ?, "abierta")',
      [mesa_id, notas, monto_extra]
    );
    const ordenId = resultado.insertId;

    // Insertar productos
    for (const p of productos) {
      await pool.query(
        'INSERT INTO orden_productos (orden_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
        [ordenId, p.id, p.cantidad, p.precio]
      );
    }

    // Marcar mesa como ocupada si no es Pickup ni Domicilio
    if (
      mesa_id !== null &&
      mesa_id !== 'Pickup' &&
      mesa_id !== 'Domicilio'
    ) {
      await pool.query('UPDATE mesas SET estado = "ocupada" WHERE id = ?', [mesa_id]);
    }

    res.json({ orden_id: ordenId });
  } catch (error) {
    console.error('Error al crear orden:', error);
    res.status(500).json({ error: 'Error al crear orden' });
  }
});

// Obtener orden por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [[orden]] = await pool.query('SELECT * FROM ordenes WHERE id = ?', [id]);
    if (!orden) return res.status(404).json({ error: 'Orden no encontrada' });

    const [productos] = await pool.query(
      `SELECT op.producto_id AS id, p.nombre, op.cantidad, op.precio_unitario AS precio
       FROM orden_productos op
       JOIN productos p ON op.producto_id = p.id
       WHERE op.orden_id = ?`,
      [id]
    );

    res.json({ ...orden, productos });
  } catch (error) {
    console.error('Error al obtener orden:', error);
    res.status(500).json({ error: 'Error al obtener orden' });
  }
});

// Cerrar orden
router.patch('/:id/cerrar', async (req, res) => {
  const { id } = req.params;

  try {
    const [ordenRows] = await pool.query('SELECT mesa_id FROM ordenes WHERE id = ?', [id]);
    if (ordenRows.length === 0) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }
    const mesa_id = ordenRows[0].mesa_id;

    await pool.query('UPDATE ordenes SET estado = "cerrada" WHERE id = ?', [id]);

    if (
      mesa_id !== null &&
      mesa_id !== 'Pickup' &&
      mesa_id !== 'Domicilio'
    ) {
      await pool.query('UPDATE mesas SET estado = "disponible" WHERE id = ?', [mesa_id]);
    }

    res.json({ success: true, message: 'Orden cerrada y mesa liberada' });
  } catch (error) {
    console.error('Error al cerrar orden:', error);
    res.status(500).json({ error: 'Error al cerrar orden' });
  }
});

// Cancelar orden
router.patch('/:id/cancelar', async (req, res) => {
  const { id } = req.params;

  try {
    const [ordenRows] = await pool.query('SELECT mesa_id FROM ordenes WHERE id = ?', [id]);
    if (ordenRows.length === 0) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }
    const mesa_id = ordenRows[0].mesa_id;

    await pool.query('UPDATE ordenes SET estado = "cancelada" WHERE id = ?', [id]);

    if (
      mesa_id !== null &&
      mesa_id !== 'Pickup' &&
      mesa_id !== 'Domicilio'
    ) {
      await pool.query('UPDATE mesas SET estado = "disponible" WHERE id = ?', [mesa_id]);
    }

    res.json({ success: true, message: 'Orden cancelada y mesa liberada' });
  } catch (error) {
    console.error('Error al cancelar orden:', error);
    res.status(500).json({ error: 'Error al cancelar orden' });
  }
});

// Obtener órdenes abiertas
router.get('/abiertas', async (req, res) => {
  try {
    const [ordenes] = await pool.query(
      `SELECT o.id, o.mesa_id, m.estado AS mesa_estado, o.notas, o.monto_extra
       FROM ordenes o
       LEFT JOIN mesas m ON o.mesa_id = m.id
       WHERE o.estado = 'abierta' OR o.estado IS NULL`
    );
    res.json(ordenes);
  } catch (error) {
    console.error('Error al obtener órdenes abiertas:', error);
    res.status(500).json({ error: 'Error al obtener órdenes abiertas' });
  }
});

// Obtener todas las mesas
router.get('/mesas', async (req, res) => {
  try {
    const [mesas] = await pool.query('SELECT * FROM mesas ORDER BY id');
    res.json(mesas);
  } catch (error) {
    console.error('Error al obtener mesas:', error);
    res.status(500).json({ error: 'Error al obtener mesas' });
  }
});

export default router;
