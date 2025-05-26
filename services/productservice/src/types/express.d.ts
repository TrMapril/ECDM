import { CustomJwtPayload } from '../services/auth';

declare global {
  namespace Express {
    interface Request {
      user?: CustomJwtPayload; // Thêm thuộc tính user vào Request
    }
  }
}