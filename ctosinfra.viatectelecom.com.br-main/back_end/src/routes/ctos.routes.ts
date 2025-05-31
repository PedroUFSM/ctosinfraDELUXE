import { Router } from 'express';
import { getUltimoCTO, postCTO } from '../controllers/ctos.controller';

const router = Router();

router.get('/ultimo', getUltimoCTO);
router.post('/', postCTO);

export default router;