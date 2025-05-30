import { Request, Response } from 'express';
import { createOrderService, getOrdersByUserService, getOrderDetailsService } from '../services/order';
import { verifyAuth, CustomJwtPayload } from '../services/auth';
import { pool } from '../helpers/init_postgres';

export const createOrder = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as CustomJwtPayload).id; // Sử dụng req.user
    const { items } = req.body; // items: [{ productId, quantity, price }]
    const order = await createOrderService(userId, items);
    res.status(201).json({ message: 'Order created', order });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as CustomJwtPayload).id; // Sử dụng req.user
    const orders = await getOrdersByUserService(userId);
    res.json({ orders });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getOrderDetails = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as CustomJwtPayload).id; // Sử dụng req.user
    const orderId = parseInt(req.params.orderId);
    const orderDetails = await getOrderDetailsService(orderId, userId);
    res.json({ order: orderDetails.order, items: orderDetails.items });
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) throw new Error('No token provided');

    const decoded = verifyAuth(token) as CustomJwtPayload;
    if (decoded.role !== 'admin') throw new Error('Admin access required');

    const result = await pool.query('SELECT id, user_id, total_amount, status, created_at FROM orders');
    res.json({ orders: result.rows });
  } catch (error: any) {
    res.status(403).json({ error: error.message });
  }
};