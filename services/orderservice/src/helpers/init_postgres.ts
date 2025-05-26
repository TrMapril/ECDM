import { Pool } from 'pg';

export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

export const initPostgres = async () => {
  let retries = 5;
  while (retries) {
    try {
      await pool.connect();
      console.log('Connected to PostgreSQL');
      await pool.query(`
        CREATE TABLE IF NOT EXISTS orders (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL,
          total_amount DECIMAL(10, 2) NOT NULL,
          status VARCHAR(50) NOT NULL DEFAULT 'pending',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS order_items (
          id SERIAL PRIMARY KEY,
          order_id INTEGER NOT NULL REFERENCES orders(id),
          product_id INTEGER NOT NULL,
          quantity INTEGER NOT NULL,
          price DECIMAL(10, 2) NOT NULL
        );
      `);
      console.log('Orders and Order_Items tables created or already exist');
      break;
    } catch (error) {
      console.error(`Attempt ${5 - retries + 1} failed to connect to PostgreSQL:`, error);
      retries -= 1;
      if (!retries) throw error;
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
};