
import { supabase } from '../../commons/supabase';
import { sendNotificationEmail } from '../../commons/email';

export class VisitService {
  async createVisit(data: any) {
    console.log("[VisitService] 📝 Iniciando registro para casa:", data.houseNumber);

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
      console.error("[VisitService] ❌ Error Supabase:", error.message);
      throw new Error(`Base de datos: ${error.message}`);
    }

    const createdVisit = newVisits?.[0];
    
    if (createdVisit) {
      console.log("[VisitService] ✅ Registro guardado en DB. Iniciando notificación...");
      // Notificar sin esperar (background)
      this.notifyResident(data).catch(err => 
        console.error("[VisitService] ❌ Error fatal en notifyResident:", err)
      );
    }

    return createdVisit;
  }

  private async notifyResident(visit: any) {
    const { data: house, error } = await supabase
      .from('houses')
      .select('email, owner_email, number, owner_name')
      .eq('number', visit.houseNumber)
      .maybeSingle();

    if (error) {
      console.error("[VisitService] ❌ Error consultando casa:", error.message);
      return;
    }

    const targetEmail = house?.email || house?.owner_email;

    if (!targetEmail) {
      console.warn(`[VisitService] ⚠️ No hay email para la casa ${visit.houseNumber}.`);
      return;
    }

    console.log(`[VisitService] 📧 Preparando envío para: ${targetEmail}`);

    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
        <div style="background-color: #1e293b; color: white; padding: 20px; text-align: center;">
          <h2 style="margin: 0;">Aviso de Ingreso</h2>
        </div>
        <div style="padding: 20px; color: #334155;">
          <p>Se ha registrado un ingreso a la <b>Casa ${house.number}</b>:</p>
          <ul style="list-style: none; padding: 0;">
            <li><b>Visitante:</b> ${visit.visitorName}</li>
            <li><b>RUT:</b> ${visit.visitorRut}</li>
            <li><b>Tipo:</b> ${visit.type}</li>
            ${visit.plate ? `<li><b>Patente:</b> ${visit.plate}</li>` : ''}
          </ul>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #94a3b8;">Registrado por ${visit.conciergeName}</p>
        </div>
      </div>
    `;

    const success = await sendNotificationEmail(
      targetEmail, 
      `Ingreso registrado: Casa ${house.number}`, 
      html
    );

    if (success) {
      console.log(`[VisitService] ✨ Proceso de notificación completado para ${targetEmail}`);
    } else {
      console.error(`[VisitService] 💔 El correo no pudo ser enviado a ${targetEmail}`);
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
