import dotenv from 'dotenv';
// Debe ser lo primero en ejecutarse
dotenv.config();

import { app } from './app';

// Cambiamos el puerto por defecto a 3001
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log('-------------------------------------------');
  console.log(`🚀 GESINTVISIT PRO - API`);
  console.log(`📡 Servidor: http://localhost:${PORT}`);
  console.log('-------------------------------------------');
});