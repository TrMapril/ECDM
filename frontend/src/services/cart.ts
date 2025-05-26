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
  try {
    const response = await api.get('/cart/', {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    console.log('API Response:', response.data); // Debug log
    
    // Kiểm tra multiple formats có thể trả về từ API
    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data && Array.isArray(response.data.cart)) {
      return response.data.cart; // API trả về {cart: Array}
    } else if (response.data && Array.isArray(response.data.items)) {
      return response.data.items;
    } else if (response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    } else {
      console.warn('Unexpected API response format:', response.data);
      return []; // Trả về array rỗng thay vì undefined
    }
  } catch (error) {
    console.error('Error fetching cart:', error);
    return []; // Trả về array rỗng khi có lỗi
  }
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