import { Router } from 'express'
import * as UnidadeController from '../controllers/unidade.controller.js';

const router = Router();

router.get('/', UnidadeController.list);
router.get('/:id', UnidadeController.getById);
router.post('/', UnidadeController.create);
router.put('/:id', UnidadeController.update);
router.delete('/:id', UnidadeController.remove);

export default router;