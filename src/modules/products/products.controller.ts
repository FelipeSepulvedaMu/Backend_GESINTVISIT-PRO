import { supabase } from '../../commons/supabase';

export const ProductsController = {
  getAll: async (req: any, res: any) => {
    try {
      const { data, error } = await supabase.from('products').select('*');
      if (error) throw error;
      res.json(data || []);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },
  create: async (req: any, res: any) => {
    try {
      const { data, error } = await supabase.from('products').insert([req.body]).select();
      if (error) throw error;
      res.status(201).json(data[0]);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },
  update: async (req: any, res: any) => {
    try {
      const { data, error } = await supabase.from('products').update(req.body).eq('id', req.params.id).select();
      if (error) throw error;
      res.json(data[0]);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },
  delete: async (req: any, res: any) => {
    try {
      const { error } = await supabase.from('products').delete().eq('id', req.params.id);
      if (error) throw error;
      res.status(204).send();
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
};