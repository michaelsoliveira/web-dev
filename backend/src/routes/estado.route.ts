import { Router } from 'express'
import * as EstadoController from '../controllers/estado.controller.js';
import { Authentication } from '@/middleware/auth.middleware.js';

const router = Router();

router.get('/', Authentication(), EstadoController.list);
router.get('/:id', Authentication(), EstadoController.getById);
router.get('/municipios/:id', Authentication(), EstadoController.getMunicipios)

export default router;