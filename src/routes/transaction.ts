
import { Router,Request,Response } from 'express';
import { createTransaction } from '../controller/transactionController';
import { auth } from '../middleware/auth';
const router = Router();

router.post('/:id',createTransaction)


export default router;
