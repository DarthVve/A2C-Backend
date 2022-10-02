import { Router } from 'express';
import { getWithdrawals, withdrawal } from '../controller/withdrawalController';
import { auth } from '../middleware/auth';
const router = Router();

router.post('/', auth, withdrawal);
router.get('/all', auth, getWithdrawals);

export default router;

