import express from 'express';
import { createStaff } from '../controllers/staffController';
import { getAllStaff } from '../controllers/staffController';
const staffRouter = express.Router();


staffRouter.post('/create-staff', createStaff);
staffRouter.get('/get-all-staff', getAllStaff);
export default staffRouter;