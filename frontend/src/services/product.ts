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

// Thêm function để lấy product theo ID
export const getProductById = async (productId: number, token?: string): Promise<Product> => {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await api.get(`/products/${productId}`, { headers });
    console.log('Product by ID Response:', response.data); // Debug log
    
    // Xử lý response structure tùy theo API response format
    return response.data.product || response.data;
  } catch (error) {
    console.error(`Error fetching product ${productId}:`, error);
    // Throw error để component có thể handle fallback
    throw new Error(`Failed to fetch product ${productId}`);
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

// Thêm function để cache products (optional - để optimize performance)
let productsCache: { [key: number]: Product } = {};
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const getProductByIdCached = async (productId: number, token?: string): Promise<Product> => {
  const now = Date.now();
  
  // Check if cache is valid và có product
  if (productsCache[productId] && (now - cacheTimestamp) < CACHE_DURATION) {
    console.log(`Using cached product ${productId}`);
    return productsCache[productId];
  }
  
  // Fetch from API
  try {
    const product = await getProductById(productId, token);
    
    // Update cache
    productsCache[productId] = product;
    cacheTimestamp = now;
    
    return product;
  } catch (error) {
    // If cache exists but expired, return cached version as fallback
    if (productsCache[productId]) {
      console.warn(`API failed, using stale cache for product ${productId}`);
      return productsCache[productId];
    }
    throw error;
  }
};

// Function để clear cache (useful khi update product)
export const clearProductCache = (productId?: number) => {
  if (productId) {
    delete productsCache[productId];
  } else {
    productsCache = {};
    cacheTimestamp = 0;
  }
};