import jwt, { JwtPayload } from 'jsonwebtoken';

export interface CustomJwtPayload extends JwtPayload {
  id: number;
  role: string;
}

export const generateToken = (payload: { id: number; role: string }): string => {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1h' });
};

export const verifyToken = (token: string): CustomJwtPayload => {
  return jwt.verify(token, process.env.JWT_SECRET!) as CustomJwtPayload;
};

export const verifyAuth = (token: string): CustomJwtPayload => {
  try {
    return verifyToken(token);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};