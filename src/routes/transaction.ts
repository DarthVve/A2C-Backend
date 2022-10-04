
import { Router,Request,Response } from 'express';
import { addTransaction,getAllTransactions,getPendingTransactions } from '../controller/transactionController';
import { auth } from '../middleware/auth';
const router = Router();

router.post('/:id',addTransaction)
router.get('/:status',async (req:Request,res:Response)=>{
    if(req.params.status ==="allTransactions"){
        return await getAllTransactions(req,res);
    }
    if(req.params.status === "pending"){
        return await getPendingTransactions(req,res);
    }
})

export default router;
