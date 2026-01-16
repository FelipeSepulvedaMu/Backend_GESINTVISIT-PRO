import { supabase } from '../../commons/supabase';

export const ReportsController = {
  getPayments: async (req: any, res: any) => {
    try {
      const { data, error } = await supabase.from('payments').select('*');
      if (error) throw error;
      res.json(data || []);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },
  createPayment: async (req: any, res: any) => {
    try {
      const { data, error } = await supabase.from('payments').insert([req.body]).select();
      if (error) throw error;
      res.status(201).json(data[0]);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },
  deletePayment: async (req: any, res: any) => {
    try {
      const { error } = await supabase.from('payments').delete().eq('id', req.params.id);
      if (error) throw error;
      res.status(204).send();
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },
  getExpenses: async (req: any, res: any) => {
    try {
      const { data, error } = await supabase.from('expenses').select('*');
      if (error) throw error;
      res.json(data || []);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },
  createExpense: async (req: any, res: any) => {
    try {
      const { data, error } = await supabase.from('expenses').insert([req.body]).select();
      if (error) throw error;
      res.status(201).json(data[0]);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },
  deleteExpense: async (req: any, res: any) => {
    try {
      const { error } = await supabase.from('expenses').delete().eq('id', req.params.id);
      if (error) throw error;
      res.status(204).send();
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },
  getMeetings: async (req: any, res: any) => {
    try {
      const { data, error } = await supabase.from('meetings').select('*');
      if (error) throw error;
      res.json(data || []);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },
  createMeeting: async (req: any, res: any) => {
    try {
      const { data, error } = await supabase.from('meetings').insert([req.body]).select();
      if (error) throw error;
      res.status(201).json(data[0]);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },
  updateMeeting: async (req: any, res: any) => {
    try {
      const { data, error } = await supabase.from('meetings').update(req.body).eq('id', req.params.id).select();
      if (error) throw error;
      res.json(data[0]);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },
  deleteMeeting: async (req: any, res: any) => {
    try {
      const { error } = await supabase.from('meetings').delete().eq('id', req.params.id);
      if (error) throw error;
      res.status(204).send();
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },
  getEmployees: async (req: any, res: any) => {
    try {
      const { data, error } = await supabase.from('employees').select('*');
      if (error) throw error;
      res.json(data || []);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },
  createEmployee: async (req: any, res: any) => {
    try {
      const { data, error } = await supabase.from('employees').insert([req.body]).select();
      if (error) throw error;
      res.status(201).json(data[0]);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },
  updateEmployee: async (req: any, res: any) => {
    try {
      const { data, error } = await supabase.from('employees').update(req.body).eq('id', req.params.id).select();
      if (error) throw error;
      res.json(data[0]);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },
  getVacations: async (req: any, res: any) => {
    try {
      const { data, error } = await supabase.from('vacations').select('*');
      if (error) throw error;
      res.json(data || []);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },
  createVacation: async (req: any, res: any) => {
    try {
      const { data, error } = await supabase.from('vacations').insert([req.body]).select();
      if (error) throw error;
      res.status(201).json(data[0]);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },
  deleteVacation: async (req: any, res: any) => {
    try {
      const { error } = await supabase.from('vacations').delete().eq('id', req.params.id);
      if (error) throw error;
      res.status(204).send();
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },
  getLeaves: async (req: any, res: any) => {
    try {
      const { data, error } = await supabase.from('leaves').select('*');
      if (error) throw error;
      res.json(data || []);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },
  createLeave: async (req: any, res: any) => {
    try {
      const { data, error } = await supabase.from('leaves').insert([req.body]).select();
      if (error) throw error;
      res.status(201).json(data[0]);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },
  deleteLeave: async (req: any, res: any) => {
    try {
      const { error } = await supabase.from('leaves').delete().eq('id', req.params.id);
      if (error) throw error;
      res.status(204).send();
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },
  getShifts: async (req: any, res: any) => {
    try {
      const { data, error } = await supabase.from('shifts').select('*');
      if (error) throw error;
      res.json(data || []);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },
  saveShifts: async (req: any, res: any) => {
    try {
      const { data, error } = await supabase.from('shifts').upsert(req.body).select();
      if (error) throw error;
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },
  getLogs: async (req: any, res: any) => {
    try {
      const { data, error } = await supabase.from('logs').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      res.json(data || []);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
};