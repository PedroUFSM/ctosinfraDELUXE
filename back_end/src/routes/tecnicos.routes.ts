import { Router } from 'express';
import { getTecnicos, postTecnico } from '../controllers/tecnicos.controller';

const router = Router();

router.get('/', getTecnicos);
router.post('/', postTecnico);

export default router;