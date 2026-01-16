import { supabase } from '../../commons/supabase';

export class UsersService {
  /**
   * Valida credenciales contra la base de datos centralizada en commons.
   */
  async login(rut: string, password: string) {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('rut, name, password, role')
        .eq('rut', rut.trim())
        .maybeSingle();

      if (error || !user) {
        throw new Error('Usuario no encontrado.');
      }

      if (user.password !== password) {
        throw new Error('Credenciales inválidas.');
      }

      await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('rut', rut);

      return {
        rut: user.rut,
        name: user.name,
        role: user.role || 'user'
      };
    } catch (error: any) {
      console.error('[UsersService] Error:', error.message);
      throw error;
    }
  }

  async getAll() {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, rut, role, last_login')
      .order('name', { ascending: true });
    
    if (error) throw error;
    return data;
  }
}