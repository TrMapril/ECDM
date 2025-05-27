import { CustomJwtPayload } from '../services/auth';

declare module 'express' {
  interface Request {
    user?: CustomJwtPayload;
  }
}