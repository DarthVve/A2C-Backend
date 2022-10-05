import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';
import { TransactionInstance } from '../model/transactionModel';
import { UserInstance } from '../model/userModel';
import mailer from '../mailer/SendMail'
import { getPagination,transferAirtimeSchema,options,generateToken } from '../utility/utils';
import { adminTransactionTemplate,userTransactionTemplate } from '../mailer/EmailTemplate';
import { number } from 'joi';

const APP_EMAIL = process.env.POD_GMAIL as string;
const APP_URL = process.env.APP_URL as string;


export async function createTransaction(req:Request,res:Response) {
    try {
        const id = uuidv4();
        const userId = req.params.id
        const validationResult = transferAirtimeSchema.validate(req.body, options);

        if (validationResult.error) {
          return res.status(400).json({ Error: validationResult.error.details[0].message });
        }
const {phoneNumber, network, status, amountToSell,amountToReceive} = req.body;
        const user = await TransactionInstance.create({
          id,
          userId,
          phoneNumber,
          network,
          status,
          amountToSell,
          amountToReceive: Math.ceil(amountToSell * 0.7)
        }) as unknown as { [key: string]: string }

        if (user) {
            const userDetails = await UserInstance.findOne({where:{id:userId}})  as unknown as { [key: string]: string }
            const email = userDetails.email
            const id = user.id
            const phoneNumber= user.phoneNumber;
            const network = user.network;
            const adminHtml = adminTransactionTemplate(id,phoneNumber,network, amountToSell, amountToReceive)
            const userHtml = userTransactionTemplate()
            await mailer.sendEmail(APP_EMAIL, "harunanuhu17@gmail.com", "pls update user transaction status", adminHtml);
            await mailer.sendEmail(APP_EMAIL, email, "Account will be credited shortly", userHtml);
            
            return res.status(201).json({
                msg: `Request received, your account will be credited after confirmation`,
                user
            });
        }
        else {
          return res.status(403).json({ msg: 'Error occured, while sending request' });
        }
      } catch (err) {
        console.error(err)
        res.status(500).json({ msg: 'Transaction unsuccessful', route: '/transfer' });
      }

}


