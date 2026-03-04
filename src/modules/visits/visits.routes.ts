import { Router } from 'express';
import { createVisit, getVisits, getHouses, markExit } from './visits.controller';

const router = Router();

router.get('/', getVisits);
router.post('/', createVisit);
router.patch('/:id/exit', markExit);
router.get('/houses', getHouses);

export default router;