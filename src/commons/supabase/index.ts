
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Intentar cargar .env desde múltiples rutas para máxima compatibilidad en Windows
dotenv.config();
dotenv.config({ path: path.resolve((process as any).cwd(), '.env') });
dotenv.config({ path: path.resolve((process as any).cwd(), 'backend', '.env') });

// Credenciales constantes por si el .env falla
const SUPABASE_URL_DEFAULT = 'https://kqmyawhrzsmarrivkciy.supabase.co';
const SUPABASE_KEY_DEFAULT = 'sb_publishable_poWosXoKueqwBvAYCBWx-w_SDYiRzEJ';

const supabaseUrl = process.env.SUPABASE_URL || SUPABASE_URL_DEFAULT;
const supabaseKey = process.env.SUPABASE_KEY || SUPABASE_KEY_DEFAULT;

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('tu-id-de-proyecto')) {
  console.error('\n\x1b[41m\x1b[37m ERROR DE CONFIGURACIÓN \x1b[0m');
  console.error('\x1b[31mFaltan las credenciales de Supabase para el backend.\x1b[0m');
  (process as any).exit(1);
}

export const supabase = createClient(supabaseUrl, supabaseKey);
