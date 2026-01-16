import { Router } from 'express';
import { createVisit, getVisits, getHouses } from './visits.controller';

const router = Router();

router.get('/', getVisits);
router.post('/', createVisit);
router.get('/houses', getHouses);

export default router;