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
    
    // 🔍 DEBUG: Log tất cả data nhận được
    console.log('=== DEBUG ORDER CREATION ===');
    console.log('User ID:', userId, 'Type:', typeof userId);
    console.log('Total Amount:', totalAmount, 'Type:', typeof totalAmount);
    console.log('Items count:', items.length);
    console.log('Items detail:', JSON.stringify(items, null, 2));
    
    // Tạo đơn hàng
    const orderResult = await client.query(
      'INSERT INTO orders (user_id, total_amount) VALUES ($1, $2) RETURNING *',
      [userId, totalAmount]
    );
    const order = orderResult.rows[0];
    console.log('✅ Order created successfully:', order);

    // Thêm các sản phẩm vào order_items
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      console.log(`--- Processing item ${i + 1}/${items.length} ---`);
      console.log('Item data:', {
        productId: item.productId,
        productId_type: typeof item.productId,
        quantity: item.quantity,
        quantity_type: typeof item.quantity,
        price: item.price,
        price_type: typeof item.price,
        price_is_null: item.price === null,
        price_is_undefined: item.price === undefined
      });
      
      // Check for null/undefined values
      if (item.price === null || item.price === undefined) {
        console.error('❌ PRICE IS NULL/UNDEFINED for productId:', item.productId);
        throw new Error(`Price is null/undefined for product ${item.productId}`);
      }
      
      console.log('Executing INSERT with params:', [order.id, item.productId, item.quantity, item.price]);
      
      await client.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [order.id, item.productId, item.quantity, item.price]
      );
      
      console.log(`✅ Item ${i + 1} inserted successfully`);
    }

    await client.query('COMMIT');
    console.log('=== ORDER CREATION COMPLETED SUCCESSFULLY ===');
    return order;
  } catch (error) {
    console.error('=== ORDER CREATION ERROR ===');
    console.error('Error details:', error);
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