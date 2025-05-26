import { addToCart, getCart, updateCartItem, removeFromCart, clearCart } from '../models/cart';
import { redisClient } from '../helpers/init_redis';

const CACHE_TTL = 3600; // 1 giờ

export const addToCartService = async (userId: number, productId: number, quantity: number) => {
  const cartItem = await addToCart(userId, productId, quantity);
  // Xóa cache để đảm bảo dữ liệu mới nhất
  await redisClient.del(`cart:${userId}`);
  return cartItem;
};

export const getCartService = async (userId: number) => {
  const cacheKey = `cart:${userId}`;
  const cachedCart = await redisClient.get(cacheKey);

  if (cachedCart) {
    return JSON.parse(cachedCart);
  }

  const cart = await getCart(userId);
  await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(cart));
  return cart;
};

export const updateCartItemService = async (userId: number, productId: number, quantity: number) => {
  const cartItem = await updateCartItem(userId, productId, quantity);
  if (!cartItem) throw new Error('Cart item not found');
  await redisClient.del(`cart:${userId}`);
  return cartItem;
};

export const removeFromCartService = async (userId: number, productId: number) => {
  const success = await removeFromCart(userId, productId);
  if (!success) throw new Error('Cart item not found');
  await redisClient.del(`cart:${userId}`);
  return success;
};

export const clearCartService = async (userId: number) => {
  const success = await clearCart(userId);
  await redisClient.del(`cart:${userId}`);
  return success;
};