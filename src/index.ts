import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import staffRouter from './routes/staffRoutes';
import voterRouter from './routes/voterRoutes';
import analyticsRouter from './routes/analyticsRoutes';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// CORS Middleware
const allowedOrigins = [
  process.env['PRODUCTION_CLIENT_URL'],
  process.env['DEVELOPMENT_CLIENT_URL'],
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // Allow cookies and credentials
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    exposedHeaders: ['Set-Cookie']
  })
);

const PORT = process.env['PORT'] || 3030;
const NODE_ENV = process.env['NODE_ENV'] || "development";

// ✅ REGISTER API ROUTES FIRST
app.use('/api/staff', staffRouter);
app.use('/api/voter', voterRouter);
app.use('/api/analytics', analyticsRouter);

// ✅ DEVELOPMENT FALLBACK GOES LAST
app.use((_req, res) => {
  res.json({
    message: 'Voter Registration API - Development Mode',
    note: 'Frontend should be served separately in development',
    frontend_dev_server: 'http://localhost:5173'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${NODE_ENV} mode`);
});
