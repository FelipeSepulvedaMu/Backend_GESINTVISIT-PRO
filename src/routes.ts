import express from 'express';
import { UsersController } from './modules/users/users.controller';
import visitRoutes from './modules/visits/visits.routes';

const router = express.Router();

router.post('/login-visit', UsersController.loginVisit);
router.use('/visits', visitRoutes as any);

export { router };