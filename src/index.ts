import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import staffRouter from './routes/staffRoutes';
import voterRouter from './routes/voterRoutes';
import analyticsRouter from './routes/analyticsRoutes';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
