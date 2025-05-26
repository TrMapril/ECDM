import jwt, { JwtPayload } from 'jsonwebtoken';

interface CustomJwtPayload extends JwtPayload {
  id: number;
  role: string;
}

export const generateToken = (payload: { id: number; role: string }): string => {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1h' });
};

export const verifyToken = (token: string): CustomJwtPayload => {
  return jwt.verify(token, process.env.JWT_SECRET!) as CustomJwtPayload;
};