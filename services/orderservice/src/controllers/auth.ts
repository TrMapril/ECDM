import { Request, Response } from 'express';
import { verifyAuth } from '../services/auth';

export const verify = async (req: Request, res: Response) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) throw new Error('No token provided');

    const decoded = verifyAuth(token);
    res.json({ message: 'Token verified', user: decoded });
  } catch (error: any) {
    res.status(403).json({ error: error.message });
  }
};