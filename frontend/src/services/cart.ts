import api from './api';
import { CartItem } from '../types/cart';

export const addToCart = async (productId: number, quantity: number, token: string): Promise<void> => {
  await api.post(
    '/cart/add',
    { productId, quantity },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const getCart = async (token: string): Promise<CartItem[]> => {
  const response = await api.get('/cart/', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.items;
};

export const updateCartItem = async (productId: number, quantity: number, token: string): Promise<void> => {
  await api.put(
    `/cart/${productId}`,
    { quantity },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const deleteCartItem = async (productId: number, token: string): Promise<void> => {
  await api.delete(`/cart/${productId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const clearCart = async (token: string): Promise<void> => {
  await api.delete('/cart/', {
    headers: { Authorization: `Bearer ${token}` },
  });
};