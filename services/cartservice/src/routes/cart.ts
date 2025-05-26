import { Router } from 'express';
import { addToCart, getCart, updateCartItem, removeFromCart, clearCart } from '../controllers/cart';
import { verifyAuth } from '../services/auth'; // Chỉ import verifyAuth
import { CustomJwtPayload } from '../helpers/jwt'; // Import CustomJwtPayload từ helpers/jwt

const router = Router();

// Middleware xác thực JWT
router.use((req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = verifyAuth(token);
    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid or expired token' });
  }
});

router.post('/add', addToCart);
router.get('/', getCart);
router.put('/:productId', updateCartItem);
router.delete('/:productId', removeFromCart);
router.delete('/', clearCart);

export default router;