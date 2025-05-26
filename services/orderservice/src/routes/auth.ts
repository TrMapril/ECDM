import { Router } from 'express';
import { verify } from '../controllers/auth';

const router = Router();

router.get('/verify', verify);

export default router;