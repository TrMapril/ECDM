import { Router, Request, Response, NextFunction } from 'express';
import { createOrder, getOrders, getOrderDetails, getAllOrders } from '../controllers/order';
import { verifyAuth, CustomJwtPayload } from '../services/auth';

const router = Router();

// Middleware xác thực JWT
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = verifyAuth(token) as CustomJwtPayload;
    req.user = decoded; // Gán trực tiếp vào req.user
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid or expired token' });
  }
};

router.post('/create', authMiddleware, createOrder);
router.get('/', authMiddleware, getOrders);
router.get('/:orderId', authMiddleware, getOrderDetails);
router.get('/all', authMiddleware, getAllOrders); // Route dành cho admin

export default router;