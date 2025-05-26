import api from './api';
import { Order, OrderItem } from '../types/order';

export const createOrder = async (items: { productId: number; quantity: number; price: number }[], token: string): Promise<Order> => {
  const response = await api.post('/order/create', { items }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.order;
};

export const getOrders = async (token: string): Promise<Order[]> => {
  const response = await api.get('/order/', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.orders;
};

export const getOrderDetails = async (orderId: number, token: string): Promise<{ order: Order; items: OrderItem[] }> => {
  const response = await api.get(`/order/${orderId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};