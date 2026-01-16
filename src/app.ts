import express from 'express';
import cors from 'cors';
import { router as routes } from './routes';

const app = express();

app.use(cors());
app.use(express.json() as any);

app.use('/api', routes);

app.use((_req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

export { app };