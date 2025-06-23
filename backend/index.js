// backend/index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import usuariosRoutes from './routes/usuarios.js';
import authRoutes from './routes/auth.js'; // 👈 Este es el cambio correcto
import productosRoutes from './routes/productos.js';
import ordenesRoutes from './routes/ordenes.js';
import mesasRoutes from './routes/mesas.js';


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/usuarios', usuariosRoutes);
app.use('/api', authRoutes); // 👈 Esto sigue igual, monta login y usuario por PIN
app.use('/api/productos', productosRoutes);
app.use('/api/ordenes', ordenesRoutes);
app.use('/api/mesas', mesasRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
