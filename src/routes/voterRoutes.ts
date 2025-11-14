import express from 'express';
import { checkVoter, registerVoter, getAllVoters } from '../controllers/voterController';
const voterRouter = express.Router();

voterRouter.post('/register-voter', registerVoter);
voterRouter.post('/check-voter', checkVoter);
voterRouter.get('/get-all-voters', getAllVoters);
export default voterRouter;