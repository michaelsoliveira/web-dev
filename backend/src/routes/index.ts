import { Router } from 'express';
import usersRouter from './users.route.js'
import authRouter from './auth.route.js'

const router = Router();

router.use('/users', usersRouter);
router.use('/auth', authRouter);

export default router;