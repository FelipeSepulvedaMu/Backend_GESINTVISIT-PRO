
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

/**
 * ⚠️ IMPORTANTE PARA EL USUARIO:
 * Gmail bloquea el acceso con contraseñas normales por seguridad.
 * 
 * PASOS PARA QUE FUNCIONE:
 * 1. Ve a tu Cuenta de Google -> Seguridad.
 * 2. Activa la "Verificación en 2 pasos".
 * 3. Busca "Contraseñas de aplicaciones" (https://myaccount.google.com/apppasswords).
 * 4. Genera una para "Correo" y copia el código de 16 letras.
 * 5. Pega ese código en tu .env en la variable GMAIL_PASS.
 */

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // SSL/TLS
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
  tls: {
    // Esto ayuda a evitar problemas con certificados en algunos entornos de desarrollo
    rejectUnauthorized: false
  }
});

export const sendNotificationEmail = async (to: string, subject: string, html: string) => {
  try {
    console.log(`[EmailService] Intentando enviar notificación a: ${to}`);
    
    const info = await transporter.sendMail({
      from: `"GESINTVISIT PRO" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html,
    });
    
    console.log(`[EmailService] ✅ Correo enviado con éxito: ${info.messageId}`);
    return true;
  } catch (error: any) {
    console.error('[EmailService] ❌ ERROR AL ENVIAR CORREO:', {
      mensaje: error.message,
      codigo: error.code,
      respuesta_servidor: error.response
    });

    if (error.message.includes('Invalid login') || error.message.includes('Authentication failed')) {
      console.error('⚠️ ERROR DE AUTENTICACIÓN: Es muy probable que necesites usar una "Contraseña de Aplicación" de Google en lugar de tu clave normal.');
    }
    
    return false;
  }
};
