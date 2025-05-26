import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initPostgres } from './helpers/init_postgres';
import { initRedis } from './helpers/init_redis';
import cartRoutes from './routes/cart';
import authRoutes from './routes/auth';

dotenv.config();

export const startServer = async () => {
  const app: Application = express();
  const port = process.env.PORT || 3003;

  app.use(express.json());
  app.use(cors());

  // Khởi tạo kết nối PostgreSQL và Redis
  await initPostgres();
  await initRedis();

  // Định tuyến
  app.use('/cart', cartRoutes);
  app.use('/auth', authRoutes);

  app.listen(port, () => {
    console.log(`CartService running on port ${port} at ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}`);
  });
};