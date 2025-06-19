const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.post('/login', async (req, res) => {
    const { pin } = req.body;

    if (!pin) return res.status(400).json({ error: 'PIN requerido' });

    try {
        const [rows] = await db.query('SELECT * FROM users WHERE pin = ?', [pin]);
        if (rows.length === 0) {
            return res.status(401).json({ error: 'PIN incorrecto' });
        }

        const user = rows[0];
        console.log('Usuario logeado:', user);  // <-- Agrega este log para ver el usuario en consola
        res.json({ id: user.id, name: user.name, role: user.role });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});


router.get('/usuario/:pin', async (req, res) => {
    const { pin } = req.params;

    if (!pin) return res.status(400).json({ error: 'PIN requerido' });

    try {
        const [rows] = await db.query('SELECT id, name, role FROM users WHERE pin = ?', [pin]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const usuario = rows[0];  // guardo el usuario en una variable

        console.log('Usuario encontrado:', usuario);  // lo muestro en consola backend

        res.json(usuario);  // lo envío en la respuesta
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});




module.exports = router;
