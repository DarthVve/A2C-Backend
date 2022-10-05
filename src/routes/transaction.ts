
import { Router,Request,Response } from 'express';
import { createTransaction,getAllTransactions,getPendingTransactions,uniqueTransaction } from '../controller/transactionController';
import { auth } from '../middleware/auth';
const router = Router();

router.post('/:id',createTransaction)
router.get('/transactions/:status',async(req:Request,res:Response)=>{
    if(req.params.status === "allTransactions"){
        return await getAllTransactions(req,res)
    }
    if(req.params.status === "pending"){
        return await getPendingTransactions(req,res)
    }
    
})
router.get('/:id',(req,res)=>{
    res.send("hellow world")
})


export default router;
