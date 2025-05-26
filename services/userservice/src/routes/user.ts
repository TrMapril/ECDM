import { Router } from 'express';
import { getProfile } from '../controllers/user';
import { verifyToken } from '../helpers/jwt';

const router = Router();

// Middleware xác thực JWT
router.use((req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = verifyToken(token);
    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid or expired token' });
  }
});

router.get('/profile', getProfile);

export default router;