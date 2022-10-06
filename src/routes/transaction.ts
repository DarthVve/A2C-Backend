
import { Router } from 'express';
import { createTransaction, getTransactions, uniqueTransaction } from '../controller/transactionController';
import { auth } from '../middleware/auth';
const router = Router();

router.post('/:id',auth, createTransaction)
router.get('/transactions/:type', getTransactions)
router.get('/:id',uniqueTransaction)

export default router;
