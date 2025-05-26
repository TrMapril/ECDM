import { Router } from 'express';
import { registerUserController, loginUserController } from '../controllers/auth';

const router = Router();

router.post('/register', registerUserController);
router.post('/login', loginUserController);

router.options('/register', (req, res) => {
  res.status(200).end();
});
router.options('/login', (req, res) => {
  res.status(200).end();
});

export default router;