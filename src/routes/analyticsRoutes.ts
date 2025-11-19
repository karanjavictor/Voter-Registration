import express from 'express';
const analyticsRouter = express.Router();
import { getAnalytics } from '../controllers/analyticsController';

analyticsRouter.get('/get-analytics', getAnalytics)

export default analyticsRouter;