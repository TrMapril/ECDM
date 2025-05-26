import { Pool } from 'pg';
import bcrypt from 'bcryptjs'; // Sử dụng bcryptjs thay vì bcrypt

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
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          role VARCHAR(50) NOT NULL DEFAULT 'customer',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('Users table created or already exist');

      // Thêm tài khoản admin nếu chưa tồn tại
      const adminEmail = 'admin123@gmail.com';
      const adminPassword = '123456';
      const hashedPassword = await bcrypt.hash(adminPassword, 10); // Sử dụng bcryptjs để hash
      const checkAdmin = await pool.query('SELECT * FROM users WHERE email = $1', [adminEmail]);
      if (checkAdmin.rows.length === 0) {
        await pool.query(
          'INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING *',
          [adminEmail, hashedPassword, 'admin']
        );
        console.log('Admin account created: admin123@gmail.com');
      } else {
        console.log('Admin account already exists: admin123@gmail.com');
      }

      break;
    } catch (error) {
      console.error(`Attempt ${5 - retries + 1} failed to connect to PostgreSQL:`, error);
      retries -= 1;
      if (!retries) throw error;
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
};