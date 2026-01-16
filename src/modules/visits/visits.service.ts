
import { supabase } from '../../commons/supabase';
import { sendNotificationEmail } from '../../commons/email';

export class VisitService {
  async createVisit(data: any) {
    console.log("[VisitService] 📝 Registro en DB para casa:", data.houseNumber);

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
      // Disparamos la notificación y seguimos adelante
      console.log("[VisitService] ✅ Registro OK. Notificando en background...");
      this.notifyResident(data).catch(err => 
        console.error("[VisitService] ❌ Falló notificación background:", err.message)
      );
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
      console.warn(`[VisitService] ⚠️ Abortado: Casa ${visit.houseNumber} no tiene email o hubo error DB.`);
      return;
    }

    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; font-size: 16px;">
        <div style="background-color: #1e293b; color: white; padding: 25px; text-align: center;">
          <h2 style="margin: 0; font-size: 20px;">Aviso de Ingreso Registrado</h2>
        </div>
        <div style="padding: 30px; color: #334155; line-height: 1.5;">
          <p>Estimado/a <strong>${house.owner_name}</strong>,</p>
          <p>Le informamos que se ha registrado un ingreso a su domicilio (<b>Casa ${house.number}</b>):</p>
          
          <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; border-left: 4px solid #3b82f6; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Visitante:</strong> ${visit.visitorName}</p>
            <p style="margin: 5px 0;"><strong>RUT:</strong> ${visit.visitorRut}</p>
            <p style="margin: 5px 0;"><strong>Tipo:</strong> ${visit.type.toUpperCase()}</p>
            ${visit.plate ? `<p style="margin: 5px 0;"><strong>Patente:</strong> ${visit.plate}</p>` : ''}
          </div>
          
          <p style="font-size: 13px; color: #64748b;">
            Registrado por conserjería: <strong>${visit.conciergeName}</strong>.
          </p>
        </div>
        <div style="background-color: #f1f5f9; padding: 15px; text-align: center; font-size: 12px; color: #94a3b8;">
          SISTEMA GESINTVISIT PRO - Gestión de Accesos
        </div>
      </div>
    `;

    await sendNotificationEmail(
      house.email, 
      `Ingreso registrado: ${visit.visitorName} (Casa ${house.number})`, 
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
