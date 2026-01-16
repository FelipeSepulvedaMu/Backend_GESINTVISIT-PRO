
import { supabase } from '../../commons/supabase';
import { sendNotificationEmail } from '../../commons/email';

export class VisitService {
  async createVisit(data: any) {
    console.log("[VisitService] 📝 Guardando visita para casa:", data.houseNumber);

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
      console.error("[VisitService] ❌ Error DB:", error.message);
      throw new Error(`DB Error: ${error.message}`);
    }

    const createdVisit = newVisits?.[0];
    
    if (createdVisit) {
      console.log("[VisitService] ✅ Registro OK. Notificando...");
      // Notificación asíncrona total
      setTimeout(() => {
        this.notifyResident(data).catch(err => 
          console.error("[VisitService] ❌ Error background email:", err)
        );
      }, 0);
    }

    return createdVisit;
  }

  private async notifyResident(visit: any) {
    const { data: house, error } = await supabase
      .from('houses')
      .select('email, number, owner_name')
      .eq('number', visit.houseNumber)
      .maybeSingle();

    if (error || !house?.email) {
      console.log(`[VisitService] ⚠️ No se enviará correo (Sin email o error DB).`);
      return;
    }

    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px; padding: 20px;">
        <h2 style="color: #1e293b;">Aviso de Ingreso</h2>
        <p>Hola <b>${house.owner_name}</b>, se registró un ingreso:</p>
        <hr/>
        <p><b>Visitante:</b> ${visit.visitorName}</p>
        <p><b>RUT:</b> ${visit.visitorRut}</p>
        <p><b>Tipo:</b> ${visit.type}</p>
        ${visit.plate ? `<p><b>Patente:</b> ${visit.plate}</p>` : ''}
        <hr/>
        <p style="font-size: 11px; color: #666;">Registrado por ${visit.conciergeName}</p>
      </div>
    `;

    await sendNotificationEmail(
      house.email, 
      `Ingreso Casa ${house.number}: ${visit.visitorName}`, 
      html
    );
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
