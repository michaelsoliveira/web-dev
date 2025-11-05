import { Router } from 'express'
import * as UnidadeController from '../controllers/unidade.controller.js';
import { Authentication } from '@/middleware/auth.middleware.js';

const router = Router();

router.get('/', Authentication(), UnidadeController.list);
router.get('/:id', Authentication(), UnidadeController.getById);
router.post('/', Authentication(), UnidadeController.create);
router.put('/:id', Authentication(), UnidadeController.update);
router.delete('/:id', Authentication(), UnidadeController.remove);

export default router;