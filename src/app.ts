import express from 'express';
import cors from 'cors';
import { router as routes } from './routes';

const app = express();

// CORS: solo permite tu frontend en Vercel
app.use(cors({
  origin: '*', // permite cualquier origen temporalmente
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json() as any);

// Rutas del backend
app.use('/api', routes);

// Manejo de rutas no encontradas
app.use((_req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

export { app };
