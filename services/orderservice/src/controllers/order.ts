import { Request, Response } from 'express';
import { createOrderService, getOrdersByUserService, getOrderDetailsService } from '../services/order';

export const createOrder = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { items } = req.body; // items: [{ productId, quantity, price }]
    const order = await createOrderService(userId, items);
    res.status(201).json({ message: 'Order created', order });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const orders = await getOrdersByUserService(userId);
    res.json({ orders });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getOrderDetails = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const orderId = parseInt(req.params.orderId);
    const orderDetails = await getOrderDetailsService(orderId, userId);
    res.json({ order: orderDetails.order, items: orderDetails.items });
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};