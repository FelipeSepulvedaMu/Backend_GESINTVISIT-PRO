
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Limpieza agresiva de credenciales
const GMAIL_USER = (process.env.GMAIL_USER || '').trim();
// Eliminamos CUALQUIER espacio de la clave de aplicación
const GMAIL_PASS = (process.env.GMAIL_PASS || '').replace(/\s+/g, '');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, 
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_PASS,
  },
  // Activamos logs de protocolo para ver EXACTAMENTE por qué falla en Render
  debug: true, 
  logger: true,
  tls: {
    rejectUnauthorized: false // Ayuda a evitar problemas de certificados en entornos cloud
  },
  connectionTimeout: 8000, // 8 segundos máximo para conectar
  greetingTimeout: 8000,
  socketTimeout: 8000,
});

export const verifyEmailConfig = async () => {
  try {
    console.log('[EmailService] 🔍 Iniciando verificación SMTP...');
    
    if (!GMAIL_USER || GMAIL_USER.includes('tu-correo')) {
      console.error('[EmailService] ❌ Error: Debes configurar GMAIL_USER en las variables de entorno de Render.');
      return false;
    }

    if (!GMAIL_PASS || GMAIL_PASS.length !== 16) {
      console.error(`[EmailService] ❌ Error: La clave de Gmail debe tener 16 caracteres. Recibidos: ${GMAIL_PASS.length}`);
      return false;
    }

    await transporter.verify();
    console.log('[EmailService] ✅ SMTP Autenticado y Listo.');
    return true;
  } catch (error: any) {
    console.error('[EmailService] ❌ Error de conexión SMTP:', error.message);
    return false;
  }
};

export const sendNotificationEmail = async (to: string, subject: string, html: string) => {
  try {
    console.log(`[EmailService] 🚀 Disparando correo hacia: ${to}`);
    
    const info = await transporter.sendMail({
      from: `"GESINTVISIT PRO" <${GMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log(`[EmailService] ✅ ÉXITO: Correo entregado (ID: ${info.messageId})`);
    return true;
  } catch (error: any) {
    console.error('[EmailService] ❌ FALLO DE ENVÍO:', error.message);
    if (error.code === 'EAUTH') {
      console.error('   Causa probable: La clave de aplicación de Gmail es incorrecta o el usuario no es válido.');
    }
    return false;
  }
};
