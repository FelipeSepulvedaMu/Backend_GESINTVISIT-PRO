
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const GMAIL_USER = (process.env.GMAIL_USER || '').trim();
const GMAIL_PASS = (process.env.GMAIL_PASS || '').replace(/\s+/g, '');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // false para puerto 587 (STARTTLS)
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_PASS,
  },
  // Configuración de seguridad para STARTTLS
  tls: {
    ciphers: 'SSLv3',
    rejectUnauthorized: false
  },
  // Tiempos de espera aún más cortos para detectar fallos rápido
  connectionTimeout: 5000,
  greetingTimeout: 5000,
  socketTimeout: 5000,
  debug: true, 
  logger: true
});

export const verifyEmailConfig = async () => {
  try {
    console.log('[EmailService] 🔍 Verificando conexión en puerto 587...');
    
    if (!GMAIL_USER || !GMAIL_PASS) {
      console.error('[EmailService] ❌ Faltan credenciales GMAIL_USER o GMAIL_PASS.');
      return false;
    }

    // El método verify() intenta establecer la conexión completa
    await transporter.verify();
    console.log('[EmailService] ✅ Conexión SMTP puerto 587 establecida y autenticada.');
    return true;
  } catch (error: any) {
    console.error('[EmailService] ❌ Falló la verificación SMTP:');
    console.error(`   Mensaje: ${error.message}`);
    return false;
  }
};

export const sendNotificationEmail = async (to: string, subject: string, html: string) => {
  try {
    console.log(`[EmailService] 📤 Enviando mail a: ${to} (Puerto 587)...`);
    
    const info = await transporter.sendMail({
      from: `"GESINTVISIT PRO" <${GMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log(`[EmailService] ✅ Mail enviado! ID: ${info.messageId}`);
    return true;
  } catch (error: any) {
    console.error('[EmailService] ❌ Error enviando mail:');
    console.error(`   Detalle: ${error.message}`);
    return false;
  }
};
