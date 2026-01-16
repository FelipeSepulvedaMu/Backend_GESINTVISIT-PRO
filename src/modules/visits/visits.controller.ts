
import { Request, Response } from 'express';
import { VisitService } from './visits.service';

const visitService = new VisitService();

export const createVisit = async (req: any, res: any) => {
  try {
    const visit = await visitService.createVisit(req.body);
    res.status(201).json(visit);
  } catch (error: any) {
    console.error("[VisitsController] Error:", error.message);
    res.status(400).json({ error: error.message || 'Error al registrar visita' });
  }
};

export const getVisits = async (req: any, res: any) => {
  try {
    const date = req.query.date as string || new Date().toISOString().split('T')[0];
    const visits = await visitService.getVisitsByDate(date);
    res.json(visits);
  } catch (error: any) {
    res.status(500).json({ error: 'Error al obtener historial' });
  }
};

export const getHouses = async (_: any, res: any) => {
  try {
    const houses = await visitService.getHouses();
    res.json(houses);
  } catch (error: any) {
    res.status(500).json({ error: 'Error al obtener residentes' });
  }
};
