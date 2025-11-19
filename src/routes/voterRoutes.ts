import express from 'express';
import { checkVoter, registerVoter, getAllVoters, updateVoter } from '../controllers/voterController';
const voterRouter = express.Router();

voterRouter.post('/register-voter', registerVoter);
voterRouter.post('/check-voter', checkVoter);
voterRouter.get('/get-all-voters', getAllVoters);
voterRouter.patch('/update-voter', updateVoter);
export default voterRouter;