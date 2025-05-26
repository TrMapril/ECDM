import api from './api';
import { Product } from '../types/product';

export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await api.get('/products/');
    console.log('API Response:', response.data); // Thêm log để debug
    return response.data.products || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const createProduct = async (product: Omit<Product, 'id'>, token: string): Promise<Product> => {
  const response = await api.post('/products/', product, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.product;
};

export const updateProduct = async (id: number, product: Partial<Product>, token: string): Promise<Product> => {
  const response = await api.put(`/products/${id}`, product, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.product;
};

export const deleteProduct = async (id: number, token: string): Promise<void> => {
  await api.delete(`/products/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};