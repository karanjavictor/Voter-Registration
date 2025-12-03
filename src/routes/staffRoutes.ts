import express from 'express';
import { createStaff, getAllStaff, updateStaff, loginStaff } from '../controllers/staffController';
const staffRouter = express.Router();


staffRouter.post('/create-staff', createStaff);
staffRouter.get('/get-all-staff', getAllStaff);
staffRouter.patch('/update-staff', updateStaff);
staffRouter.post('/login', loginStaff);
export default staffRouter;