import { Router } from 'express';
import usersRouter from './users.route.js'
import authRouter from './auth.route.js'
import unidadeRouter from './unidade.route.js'

const router = Router();

router.use('/users', usersRouter);
router.use('/auth', authRouter);
router.use('/unidade', unidadeRouter)

export default router;