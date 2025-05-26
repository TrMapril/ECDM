import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initPostgres } from './helpers/init_postgres';
import orderRoutes from './routes/order';
import authRoutes from './routes/auth';

dotenv.config();

export const startServer = async () => {
  const app: Application = express();
  const port = process.env.PORT || 3004;

  app.use(express.json());
  app.use(cors());

  // Khởi tạo kết nối PostgreSQL
  await initPostgres();

  // Định tuyến
  app.use('/order', orderRoutes);
  app.use('/auth', authRoutes);

  app.listen(port, () => {
    console.log(`OrderService running on port ${port} at ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}`);
  });
};