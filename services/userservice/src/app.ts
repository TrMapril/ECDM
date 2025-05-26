import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initPostgres } from './helpers/init_postgres';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';

dotenv.config();

export const startServer = async () => {
  const app: Application = express();
  const port = process.env.PORT || 3001;

  // Cấu hình CORS chi tiết
  app.use(cors({
    origin: 'http://localhost:3000', // Cho phép frontend tại localhost:3000
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Các phương thức HTTP được phép
    allowedHeaders: ['Content-Type', 'Authorization'], // Các header được phép
    credentials: true, // Nếu cần gửi cookie hoặc credentials
  }));

  // Xử lý preflight request (OPTIONS) nếu cần
  app.options('*', cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }));

  app.use(express.json());

  // Khởi tạo kết nối PostgreSQL
  await initPostgres();

  // Định tuyến
  app.use('/auth', authRoutes);
  app.use('/users', userRoutes);

  app.listen(port, () => {
    console.log(`UserService running on port ${port} at ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}`);
  });
};