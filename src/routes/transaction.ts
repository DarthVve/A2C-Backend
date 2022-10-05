
import { Router } from 'express';
import { createTransaction } from '../controller/transactionController';
import { auth } from '../middleware/auth';
const router = Router();

router.post('/:id', auth, createTransaction)


export default router;
