import { Router } from 'express';
import cidadesRoutes from './cidades.routes';
import tecnicosRoutes from './tecnicos.routes';
import ctosRoutes from './ctos.routes';

const router = Router();

router.use('/cidades', cidadesRoutes);
router.use('/tecnicos', tecnicosRoutes);
router.use('/ctos', ctosRoutes);

export default router;