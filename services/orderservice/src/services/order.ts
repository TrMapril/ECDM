import { createOrder, getOrdersByUser, getOrderDetails } from '../models/order';

export const createOrderService = async (userId: number, items: { productId: number; quantity: number; price: number }[]) => {
  const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const order = await createOrder(userId, totalAmount, items);
  return order;
};

export const getOrdersByUserService = async (userId: number) => {
  return await getOrdersByUser(userId);
};

export const getOrderDetailsService = async (orderId: number, userId: number) => {
  return await getOrderDetails(orderId, userId);
};