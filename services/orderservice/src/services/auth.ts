import jwt, { JwtPayload } from 'jsonwebtoken';

export interface CustomJwtPayload extends JwtPayload {
  id: number;
  role: string;
  iat?: number;
  exp?: number;
}

export const verifyAuth = (token: string): CustomJwtPayload => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as CustomJwtPayload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};