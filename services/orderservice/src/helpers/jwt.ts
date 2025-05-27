import jwt from 'jsonwebtoken';

export const generateToken = (payload: { id: number; role: string }): string => {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1h' });
};