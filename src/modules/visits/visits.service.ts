
import { supabase } from '../../commons/supabase';
import { sendNotificationEmail } from '../../commons/email';

export class VisitService {
  async createVisit(data: any) {
    console.log("[VisitService] 📝 Guardando visita en DB para casa:", data.houseNumber);

    const payload = {
      date: data.date, 
      house_number: data.houseNumber,
      resident_name: data.residentName,
      type: data.type,
      visitor_name: data.visitorName,
      visitor_rut: data.visitorRut,
      plate: data.plate || null,
      concierge_name: data.conciergeName
    };

    const { data: newVisits, error } = await supabase
      .from('visits')
      .insert([payload])
      .select();

    if (error) {
      console.error("[VisitService] ❌ Error en insert de Supabase:", error.message);
      throw new Error(`DB Error: ${error.message}`);
    }

    const createdVisit = newVisits?.[0];
    
    if (createdVisit) {
      console.log("[VisitService] ✅ Guardado ok. Iniciando tarea de notificación en segundo plano...");
      // Lanzamos la notificación sin bloquear la respuesta al cliente
      this.notifyResident(data).catch(err => 
        console.error("[VisitService] ❌ Error crítico en hilo de notificación:", err)
      );
    }

    return createdVisit;
  }

  private async notifyResident(visit: any) {
    console.log(`[VisitService] 🔍 Consultando email para Casa ${visit.houseNumber}...`);
    
    // Ajustado al esquema real: seleccionamos 'email' y 'owner_name'
    const { data: house, error } = await supabase
      .from('houses')
      .select('email, number, owner_name')
      .eq('number', visit.houseNumber)
      .maybeSingle();

    if (error) {
      console.error("[VisitService] ❌ Error consultando tabla houses:", error.message);
      return;
    }

    if (!house?.email) {
      console.warn(`[VisitService] ⚠️ Abortado: La casa ${visit.houseNumber} no tiene un 'email' registrado.`);
      return;
    }

    console.log(`[VisitService] 📧 Email encontrado: ${house.email}. Preparando plantilla...`);

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #edf2f7; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        <div style="background-color: #1e293b; color: white; padding: 24px; text-align: center;">
          <h2 style="margin: 0; font-size: 20px;">GESINTVISIT PRO - Notificación</h2>
        </div>
        <div style="padding: 32px; color: #334155; line-height: 1.6;">
          <p>Hola <strong>${house.owner_name}</strong>,</p>
          <p>Se ha registrado un nuevo ingreso a su propiedad (<b>Casa ${house.number}</b>):</p>
          
          <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; border-left: 4px solid #3b82f6; margin: 24px 0;">
            <p style="margin: 4px 0;"><strong>Visitante:</strong> ${visit.visitorName}</p>
            <p style="margin: 4px 0;"><strong>RUT:</strong> ${visit.visitorRut}</p>
            <p style="margin: 4px 0;"><strong>Tipo:</strong> ${visit.type === 'visita' ? 'Visita' : 'Encomienda/Paquete'}</p>
            ${visit.plate ? `<p style="margin: 4px 0;"><strong>Patente:</strong> ${visit.plate}</p>` : ''}
            <p style="margin: 4px 0;"><strong>Fecha/Hora:</strong> ${new Date().toLocaleString('es-CL')}</p>
          </div>
          
          <p style="font-size: 13px; color: #64748b; margin-top: 24px;">
            Este es un sistema de seguridad automático. Registrado por: <strong>${visit.conciergeName}</strong>.
          </p>
        </div>
        <div style="background-color: #f1f5f9; padding: 16px; text-align: center; font-size: 11px; color: #94a3b8;">
          © ${new Date().getFullYear()} GESINTVISIT PRO - Sistema de Gestión de Accesos
        </div>
      </div>
    `;

    const success = await sendNotificationEmail(
      house.email, 
      `Aviso de Ingreso: ${visit.visitorName} (Casa ${house.number})`, 
      html
    );

    if (success) {
      console.log(`[VisitService] ✨ Notificación finalizada con éxito para ${house.email}`);
    } else {
      console.error(`[VisitService] 💔 Falló el envío final al destinatario ${house.email}`);
    }
  }

  async getVisitsByDate(date: string) {
    const { data, error } = await supabase
      .from('visits')
      .select('*')
      .gte('date', `${date}T00:00:00`)
      .lte('date', `${date}T23:59:59`)
      .order('date', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async getHouses() {
    const { data, error } = await supabase
      .from('houses')
      .select('*')
      .order('number');
    
    if (error) throw error;
    return data || [];
  }
}
