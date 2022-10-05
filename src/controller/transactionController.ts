import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { TransactionInstance } from '../model/transactionModel';
import { UserInstance } from '../model/userModel';
import { transferAirtimeSchema, options,getPagination } from '../utility/utils';
import { adminTransactionTemplate, userTransactionTemplate } from '../mailer/EmailTemplate';

import mailer from '../mailer/SendMail'

const APP_EMAIL = process.env.POD_GMAIL as string;
const APP_URL = process.env.APP_URL as string;


export async function createTransaction(req: Request, res: Response) {
  try {
    const id = uuidv4();
    const userId = req.params.id
    const validationResult = transferAirtimeSchema.validate(req.body, options);

    if (validationResult.error) {
      return res.status(400).json({ Error: validationResult.error.details[0].message });
    }
    const { phoneNumber, network, status, amountToSell, amountToReceive } = req.body;
    const userDetails = await UserInstance.findOne({ where: { id: userId } }) as unknown as { [key: string]: string };
    const email = userDetails.email;
    const transaction = await TransactionInstance.create({
      id,
      userId,
      email,
      phoneNumber,
      network,
      status,
      amountToSell,
      amountToReceive: Math.ceil(amountToSell * 0.7)
    }) as unknown as { [key: string]: string };

    if (transaction) {
      const id = transaction.id
      const phoneNumber = transaction.phoneNumber;
      const network = transaction.network;
      const adminHtml = adminTransactionTemplate(id, phoneNumber, network, amountToSell, amountToReceive);
      const userHtml = userTransactionTemplate();
      await mailer.sendEmail(APP_EMAIL, "harunanuhu17@gmail.com", "pls update transaction transaction status", adminHtml);
      await mailer.sendEmail(APP_EMAIL, email, "Account will be credited shortly", userHtml);

      return res.status(201).json({
        msg: `Request received, your account will be credited after confirmation`,
        transaction
      });
    }
    else {
      return res.status(403).json({ msg: 'Error occured, while sending request' });
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ msg: 'Transaction unsuccessful', route: '/transfer' });
  }
};


export async function getAllTransactions(req:Request,res:Response) {
  try {
      const { page, size } = req.query ;
      const { limit, offset } = getPagination(Number(page), Number(size));
      const transactions = await TransactionInstance.findAndCountAll({where:{},limit,offset});
      
      return res.status(200).json({
          msg:"transaction successful",
          totalPages: Math.ceil(transactions.count/Number(size)),
          transactions  
      });

  } catch (err) {
      res.status(500).json({ msg:"Transaction failed" });
  }  
};


export async function getPendingTransactions(req:Request,res:Response){
  try{
      const { page, size } = req.query;
      const { limit, offset } = getPagination(Number(page), Number(size));
      const pending = await TransactionInstance.findAndCountAll({
      where: { status: false }, limit, offset 
  });
  return res.status(200).json({
      msg:"successfully gotten all Pending transactions",
      totalPages: Math.ceil(pending.count/Number(size)),
      pending,
   
  })
  } catch (err) {
      res.status(500).json({ msg:"pending transactions failed" });
  }
};

export async function uniqueTransaction(req:Request,res:Response) {
  try{
      const { page, size } = req.query ;
      const {id} = req.params
      const { limit, offset } = getPagination(Number(page), Number(size));
      const transactions = await TransactionInstance.findAndCountAll({where:{id},limit,offset});
      
      return res.status(200).json({
          msg:"User transaction successful",
          totalPages: Math.ceil(transactions.count/Number(size)),
          transactions  
      });
  }catch(err){
      res.status(500).json({ msg:"user transactions failed" });
  }
}