import { Router } from 'express';
import usersRouter from './users.route.js'

const router = Router();

router.use('/users', usersRouter);

export default router;