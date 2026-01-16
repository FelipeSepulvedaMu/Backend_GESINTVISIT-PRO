import { supabase } from '../../commons/supabase';

export const UsersController = {
  loginVisit: async (req: any, res: any) => {
    const { rut, password } = req.body;
    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('rut', rut)
      .single();

    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Error' });
    }
    res.json({ rut: user.rut, name: user.name });
  }
};