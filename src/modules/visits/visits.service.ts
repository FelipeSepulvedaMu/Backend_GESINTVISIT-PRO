
import { supabase } from '../../commons/supabase';
import { sendNotificationEmail } from '../../commons/email';

export class VisitService {
  async createVisit(data: any) {
    console.log("[VisitService] Recibiendo datos para registrar:", data);

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
      console.error("[VisitService] Error de Supabase:", error.message);
      throw new Error(`Base de datos: ${error.message}`);
    }

    if (!newVisits || newVisits.length === 0) {
      throw new Error("No se pudo confirmar la creación del registro");
    }

    const createdVisit = newVisits[0];

    // Envío de correo
    this.notifyResident(data).catch(err => console.error("[VisitService] Error enviando email:", err.message));

    return createdVisit;
  }

  private async notifyResident(visit: any) {
    const { data: house } = await supabase
      .from('houses')
      .select('email, number')
      .eq('number', visit.houseNumber)
      .maybeSingle();

    if (house?.email) {
      const html = `
        <div style="font-family: sans-serif; padding: 25px; border: 1px solid #e2e8f0; border-radius: 12px; max-width: 600px; margin: auto;">
          <h2 style="color: #0f172a; margin-top: 0;">Aviso de Ingreso Registrado</h2>
          <p style="color: #64748b; font-size: 16px;">Hola, se ha registrado un ingreso a la <b>Casa ${house.number}</b>.</p>
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0;"><b>Tipo:</b> ${visit.type === 'visita' ? 'Visita Personal' : 'Entrega de Paquete'}</p>
            <p style="margin: 5px 0;"><b>Visitante:</b> ${visit.visitorName}</p>
            <p style="margin: 5px 0;"><b>RUT:</b> ${visit.visitorRut}</p>
            ${visit.plate ? `<p style="margin: 5px 0;"><b>Patente Vehículo:</b> ${visit.plate}</p>` : ''}
            <p style="margin: 5px 0;"><b>Fecha/Hora:</b> ${new Date(visit.date).toLocaleString('es-CL')}</p>
          </div>
          <p style="color: #94a3b8; font-size: 12px; margin-bottom: 0;">Este es un mensaje automático del sistema GESINTVISIT PRO.</p>
        </div>
      `;
      await sendNotificationEmail(house.email, `Control de Acceso: Ingreso registrado Casa ${house.number}`, html);
    }
  }

  async getVisitsByDate(date: string) {
    // FIX: Filtramos por el string literal de la fecha para evitar desfases de zona horaria del servidor
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
