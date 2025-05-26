import { Pool } from 'pg';
console.log('DB_HOST:', process.env.DB_HOST);

export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST || 'postgres',
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
        CREATE TABLE IF NOT EXISTS cart (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL,
          product_id INTEGER NOT NULL,
          quantity INTEGER NOT NULL DEFAULT 1,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(user_id, product_id)
        );
      `);
      console.log('Cart table created or already exists');
      break;
    } catch (error) {
      console.error(`Attempt ${5 - retries + 1} failed to connect to PostgreSQL:`, error);
      retries -= 1;
      if (!retries) throw error;
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
};