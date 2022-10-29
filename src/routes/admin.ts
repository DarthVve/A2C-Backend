import { Router } from 'express';
import { elevateToAdmin, revokeAdmin, check2FAToken } from '../controller/adminController';
import { creditWallet } from '../controller/walletController';
import { auth, adminAuth, secondAuth, superAdminAuth } from '../middleware/auth';
const router = Router();

router.post('/add', auth, superAdminAuth, elevateToAdmin);
router.post('/revoke', auth, superAdminAuth, revokeAdmin);
router.post('/authenticate', check2FAToken);
router.patch('/wallet', auth, adminAuth, secondAuth, creditWallet)

export default router;
