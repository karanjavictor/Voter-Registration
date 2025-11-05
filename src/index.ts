import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import staffRouter from './routes/staffRoutes';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env['PORT'] || 3030;
const NODE_ENV = process.env['NODE_ENV'] || "development";

  // Development mode - show message for non-API routes
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    
    res.json({ 
      message: 'Voter Registration API - Development Mode',
      note: 'Frontend should be served separately in development',
      frontend_dev_server: 'http://localhost:5173'
    });
  });

app.use('/api/staff', staffRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} in ${NODE_ENV} mode`);
});