import express from 'express';
import { createStaff, getAllStaff, updateStaff } from '../controllers/staffController';
const staffRouter = express.Router();


staffRouter.post('/create-staff', createStaff);
staffRouter.get('/get-all-staff', getAllStaff);
staffRouter.patch('/update-staff', updateStaff);
export default staffRouter;