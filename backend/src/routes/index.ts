import { Router } from 'express';
import usersRouter from './users.route.js'
import authRouter from './auth.route.js'
import unidadeRouter from './unidade.route.js'
import estadoRouter from './estado.route.js'

const router = Router();

router.use('/users', usersRouter);
router.use('/auth', authRouter);
router.use('/unidade-escolar', unidadeRouter);
router.use('/estados', estadoRouter);

export default router;