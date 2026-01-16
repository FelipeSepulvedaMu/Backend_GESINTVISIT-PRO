
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Limpiamos las variables: eliminamos espacios en blanco de la contraseña y el usuario
const GMAIL_USER = (process.env.GMAIL_USER || '').trim();
// La contraseña de aplicación de Gmail son 16 caracteres. Quitamos espacios por si el usuario los incluyó.
const GMAIL_PASS = (process.env.GMAIL_PASS || '').replace(/\s+/g, '');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true para puerto 465
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_PASS,
  },
  // Añadimos tiempos de espera para evitar que la conexión se quede colgada
  connectionTimeout: 10000, // 10 segundos
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

export const verifyEmailConfig = async () => {
  try {
    console.log('[EmailService] 🔍 Verificando credenciales...');
    
    if (!GMAIL_USER || GMAIL_USER.includes('tu-correo')) {
      console.error('[EmailService] ❌ ERROR: GMAIL_USER no está configurado con un correo real.');
      return false;
    }

    if (!GMAIL_PASS || GMAIL_PASS.length !== 16) {
      console.error('[EmailService] ❌ ERROR: GMAIL_PASS debe ser una clave de aplicación de 16 letras.');
      return false;
    }

    await transporter.verify();
    console.log('[EmailService] ✅ Conexión SMTP establecida y autenticada.');
    return true;
  } catch (error: any) {
    console.error('[EmailService] ❌ Falló la verificación SMTP:');
    console.error(`   Mensaje: ${error.message}`);
    console.error(`   Código: ${error.code}`);
    return false;
  }
};

export const sendNotificationEmail = async (to: string, subject: string, html: string) => {
  try {
    console.log(`[EmailService] 📤 Enviando mail a: ${to}...`);
    
    const info = await transporter.sendMail({
      from: `"GESINTVISIT PRO" <${GMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log(`[EmailService] ✅ Mail enviado exitosamente. ID: ${info.messageId}`);
    return true;
  } catch (error: any) {
    console.error('[EmailService] ❌ Error al intentar enviar el correo:');
    console.error(`   Detalle: ${error.message}`);
    // Si el error es ETIMEDOUT, es un problema de red del servidor cloud
    if (error.code === 'ETIMEDOUT') {
      console.error('   Sugerencia: Render podría estar bloqueando el puerto o Gmail no responde.');
    }
    return false;
  }
};
