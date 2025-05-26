import { verifyToken } from '../helpers/jwt';

export interface CustomJwtPayload {
  id: number;
  role: string;
  iat?: number;
  exp?: number;
}

export const verifyAuth = (token: string): CustomJwtPayload => {
  try {
    return verifyToken(token);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};