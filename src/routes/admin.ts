import { Router } from 'express';
import {
  elevateToAdmin,
  revokeAdmin
} from '../controller/adminController';
import { auth, adminAuth, superAdminAuth } from '../middleware/auth';
const router = Router();

router.post('/add', auth, superAdminAuth, elevateToAdmin);
router.post('/revoke', auth, superAdminAuth, revokeAdmin);

export default router;
