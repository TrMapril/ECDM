import { pool } from '../helpers/init_postgres';

export interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  status: string;
  created_at: Date;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
}

export const createOrder = async (userId: number, totalAmount: number, items: { productId: number; quantity: number; price: number }[]): Promise<Order> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Tạo đơn hàng
    const orderResult = await client.query(
      'INSERT INTO orders (user_id, total_amount) VALUES ($1, $2) RETURNING *',
      [userId, totalAmount]
    );
    const order = orderResult.rows[0];

    // Thêm các sản phẩm vào order_items
    for (const item of items) {
      await client.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [order.id, item.productId, item.quantity, item.price]
      );
    }

    await client.query('COMMIT');
    return order;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const getOrdersByUser = async (userId: number): Promise<Order[]> => {
  const result = await pool.query('SELECT * FROM orders WHERE user_id = $1', [userId]);
  return result.rows;
};

export const getOrderDetails = async (orderId: number, userId: number): Promise<{ order: Order; items: OrderItem[] }> => {
  const orderResult = await pool.query('SELECT * FROM orders WHERE id = $1 AND user_id = $2', [orderId, userId]);
  if (orderResult.rows.length === 0) throw new Error('Order not found');

  const itemsResult = await pool.query('SELECT * FROM order_items WHERE order_id = $1', [orderId]);
  return { order: orderResult.rows[0], items: itemsResult.rows };
};