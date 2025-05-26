import { Router, Request, Response, NextFunction } from 'express';
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/product';
import { verifyAuth, CustomJwtPayload } from '../services/auth';

const router = Router();

// Middleware xác thực JWT cho các endpoint cần bảo vệ
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = verifyAuth(token) as CustomJwtPayload;
    req.user = decoded; // Sử dụng req.user trực tiếp
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// Không áp dụng JWT cho GET /products và GET /:id
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Áp dụng JWT cho các endpoint thay đổi dữ liệu
router.post('/', authMiddleware, createProduct);
router.put('/:id', authMiddleware, updateProduct);
router.delete('/:id', authMiddleware, deleteProduct);

export default router;