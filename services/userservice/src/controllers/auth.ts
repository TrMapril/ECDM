import { Request, Response } from 'express';
import { register, login } from '../services/auth'; // Sửa tên hàm import

export const registerUserController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const user = await register(email, password);
    return res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message });
  }
};

export const loginUserController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const { user, token } = await login(email, password);
    return res.status(200).json({ message: 'Login successful', user, token });
  } catch (error) {
    return res.status(401).json({ error: (error as Error).message });
  }
};