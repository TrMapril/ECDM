import { Request, Response } from 'express';
import { getUserProfile } from '../services/user';

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id; // Được thêm bởi middleware
    const user = await getUserProfile(userId);
    res.json({ user });
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};