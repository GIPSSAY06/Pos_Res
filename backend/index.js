// backend/index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import usuariosRoutes from './routes/usuarios.js';
import authRoutes from './routes/auth.js'; // 👈 Este es el cambio correcto

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/usuarios', usuariosRoutes);
app.use('/api', authRoutes); // 👈 Esto sigue igual, monta login y usuario por PIN

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
