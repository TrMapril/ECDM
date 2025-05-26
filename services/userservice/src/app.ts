import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initPostgres } from './helpers/init_postgres';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';

dotenv.config();

export const startServer = async () => {
  const app: Application = express();
  const port = parseInt(process.env.PORT || '3001', 10); // Convert to number
  const host = process.env.HOST || '0.0.0.0';

  // Cấu hình CORS cho phép truy cập từ nhiều thiết bị
  const corsOptions = {
    origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
      // Cho phép requests không có origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);
      
      // Danh sách các origin được phép
      const allowedOrigins = [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        // Thêm IP của server để các thiết bị khác có thể truy cập
        `http://${process.env.SERVER_IP || 'localhost'}:3000`,
        // Pattern cho local network (có thể customize)
        /^http:\/\/192\.168\.\d+\.\d+:3000$/,
        /^http:\/\/10\.\d+\.\d+\.\d+:3000$/,
        /^http:\/\/172\.(1[6-9]|2\d|3[01])\.\d+\.\d+:3000$/
      ];

      // Kiểm tra origin có trong danh sách được phép không
      const isAllowed = allowedOrigins.some(allowedOrigin => {
        if (typeof allowedOrigin === 'string') {
          return origin === allowedOrigin;
        } else if (allowedOrigin instanceof RegExp) {
          return allowedOrigin.test(origin);
        }
        return false;
      });

      if (isAllowed) {
        callback(null, true);
      } else {
        console.log(`CORS blocked origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  };

  app.use(cors(corsOptions));

  // Xử lý preflight request
  app.options('*', cors(corsOptions));

  app.use(express.json());

  // Khởi tạo kết nối PostgreSQL
  await initPostgres();

  // Định tuyến
  app.use('/auth', authRoutes);
  app.use('/users', userRoutes);

  // QUAN TRỌNG: Bind với 0.0.0.0 để cho phép truy cập từ tất cả network interfaces
  app.listen(port, host, () => {
    console.log(`UserService running on ${host}:${port} at ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}`);
    console.log(`Access from other devices: http://YOUR_SERVER_IP:${port}`);
  });
};