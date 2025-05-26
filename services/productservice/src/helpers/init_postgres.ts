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
        CREATE TABLE IF NOT EXISTS products (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          category VARCHAR(100) DEFAULT 'Kinh tế',
          publisher VARCHAR(100) DEFAULT 'ABC',
          price DECIMAL(10, 2) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('Products table created or already exists');
      break;
    } catch (error) {
      console.error(`Attempt ${5 - retries + 1} failed to connect to PostgreSQL:`, error);
      retries -= 1;
      if (!retries) throw error;
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
};