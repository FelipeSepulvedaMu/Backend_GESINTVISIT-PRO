
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const GMAIL_USER = (process.env.GMAIL_USER || '').trim();
const GMAIL_PASS = (process.env.GMAIL_PASS || '').replace(/\s+/g, '');

/**
 * Configuramos el transporte usando el shortcut 'service: gmail'.
 * Nodemailer ya sabe qué puertos y hosts usar internamente.
 * Agregamos un pool para mantener la conexión abierta si es posible.
 */
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_PASS,
  },
  pool: true, // Reutiliza conexiones para mejorar rendimiento
  maxConnections: 1,
  connectionTimeout: 20000, // 20 segundos para entornos lentos como Render
  greetingTimeout: 20000,
  socketTimeout: 20000,
  debug: true, 
  logger: true
});

export const verifyEmailConfig = async () => {
  try {
    console.log('[EmailService] 🔍 Probando configuración optimizada de Gmail...');
    
    if (!GMAIL_USER || !GMAIL_PASS) {
      console.error('[EmailService] ❌ Faltan credenciales.');
      return false;
    }

    await transporter.verify();
    console.log('[EmailService] ✅ Conexión verificada exitosamente.');
    return true;
  } catch (error: any) {
    console.error('[EmailService] ❌ Error de verificación:', error.message);
    return false;
  }
};

export const sendNotificationEmail = async (to: string, subject: string, html: string) => {
  try {
    console.log(`[EmailService] 📧 Enviando notificación a: ${to}...`);
    
    const info = await transporter.sendMail({
      from: `"GESINTVISIT PRO" <${GMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log(`[EmailService] ✨ Correo enviado con éxito (ID: ${info.messageId})`);
    return true;
  } catch (error: any) {
    console.error('[EmailService] ❌ Error crítico al enviar:', error.message);
    // Si falla por timeout, damos un consejo específico en el log
    if (error.message.includes('timeout')) {
      console.error('   👉 Render está tardando demasiado en conectar. Intenta nuevamente.');
    }
    return false;
  }
};
