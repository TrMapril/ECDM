import { pool } from '../helpers/init_postgres';

export interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  created_at: Date;
}

export const addToCart = async (userId: number, productId: number, quantity: number): Promise<CartItem> => {
  const result = await pool.query(
    `INSERT INTO cart (user_id, product_id, quantity)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id, product_id)
     DO UPDATE SET quantity = cart.quantity + $3
     RETURNING *`,
    [userId, productId, quantity]
  );
  return result.rows[0];
};

export const getCart = async (userId: number): Promise<CartItem[]> => {
  const result = await pool.query('SELECT * FROM cart WHERE user_id = $1', [userId]);
  return result.rows;
};

export const updateCartItem = async (userId: number, productId: number, quantity: number): Promise<CartItem | null> => {
  const result = await pool.query(
    'UPDATE cart SET quantity = $1 WHERE user_id = $2 AND product_id = $3 RETURNING *',
    [quantity, userId, productId]
  );
  return result.rows.length > 0 ? result.rows[0] : null;
};

export const removeFromCart = async (userId: number, productId: number): Promise<boolean> => {
  const result = await pool.query('DELETE FROM cart WHERE user_id = $1 AND product_id = $2 RETURNING *', [userId, productId]);
  return result.rows.length > 0;
};

export const clearCart = async (userId: number): Promise<boolean> => {
  const result = await pool.query('DELETE FROM cart WHERE user_id = $1 RETURNING *', [userId]);
  return result.rows.length > 0;
};