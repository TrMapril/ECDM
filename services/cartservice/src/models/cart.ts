import { pool } from '../helpers/init_postgres';
import axios from 'axios';

export interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  price: number;
  created_at: Date;
}

export interface Product {
  product_id: number;
  price: number;
}

export const addToCart = async (userId: number, productId: number, quantity: number): Promise<CartItem> => {
  let price = 0;
  try {
    const response = await axios.get<Product>(`http://kong:8000/product/${productId}`);
    price = Number(response.data.price) || 0;
  } catch (error) {
    console.error(`Failed to fetch price for product ${productId}:`, error);
  }

  const result = await pool.query(
    `INSERT INTO cart (user_id, product_id, quantity, price)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (user_id, product_id)
     DO UPDATE SET quantity = cart.quantity + $3, price = $4
     RETURNING id, user_id, product_id, quantity, price, created_at`,
    [userId, productId, quantity, price]
  );
  return result.rows[0];
};

export const getCart = async (userId: number): Promise<CartItem[]> => {
  const result = await pool.query(
    'SELECT id, user_id, product_id, quantity, price, created_at FROM cart WHERE user_id = $1',
    [userId]
  );
  return result.rows.map((item) => ({
    id: item.id,
    user_id: item.user_id,
    product_id: item.product_id,
    quantity: item.quantity,
    price: Number(item.price) || 0,
    created_at: item.created_at,
  }));
};

export const updateCartItem = async (userId: number, productId: number, quantity: number): Promise<CartItem | null> => {
  let price = 0;
  try {
    const response = await axios.get<Product>(`http://kong:8000/product/${productId}`);
    price = Number(response.data.price) || 0;
  } catch (error) {
    console.error(`Failed to fetch price for product ${productId}:`, error);
  }

  const result = await pool.query(
    'UPDATE cart SET quantity = $1, price = $4 WHERE user_id = $2 AND product_id = $3 RETURNING id, user_id, product_id, quantity, price, created_at',
    [quantity, userId, productId, price]
  );
  return result.rows.length > 0 ? result.rows[0] : null;
};

export const removeFromCart = async (userId: number, productId: number): Promise<boolean> => {
  const result = await pool.query(
    'DELETE FROM cart WHERE user_id = $1 AND product_id = $2 RETURNING *',
    [userId, productId]
  );
  return result.rows.length > 0;
};

export const clearCart = async (userId: number): Promise<boolean> => {
  const result = await pool.query('DELETE FROM cart WHERE user_id = $1 RETURNING *', [userId]);
  return result.rows.length > 0;
};