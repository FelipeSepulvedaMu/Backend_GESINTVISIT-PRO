import express from 'express';
import cors from 'cors';
import { router as routes } from './routes';

const app = express();

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || '*', // si no existe, permite cualquier origen
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json() as any);

app.use('/api', routes);

app.use((_req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

export { app };
