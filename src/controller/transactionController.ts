import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { TransactionInstance } from '../model/transactionModel';
import { UserInstance } from '../model/userModel';
import { transferSchema, options } from '../utility/utils';

const adminNumber = ['09011111111', '09022222222', '09033333333', '09088888888'];
const selectedNetwork = ['MTN', 'GLO', '9MOBILE', 'AIRTEL'];

export async function createTransaction(req: Request | any, res: Response) {
  try {
    const id = uuidv4();
    const userId = req.user;


    const { network, phoneNumber, amountToSell, amountToReceive } = req.body;




    const validateInput = await transferSchema.validate(req.body, options);
    if (validateInput.error) {
      return res.status(400).json(validateInput.error.details[0].message);
    }
    const validatedUser = await UserInstance.findOne({ where: { id: userId } });

    if (!validatedUser) {
      return res.status(401).json({ message: 'Sorry user does not exist!' });
    }

    // let destinationPhoneNumber;
    // let USSD;
    // const amountToRecieve = 0.7 * amountToSell;

    // switch (network) {
    //   case 'MTN':
    //     destinationPhoneNumber = adminNumber[0];
    //     USSD = `*600*${destinationPhoneNumber}*${amountToSell}*${sharePin}#`;
    //     break;

    //   case 'GLO':
    //     destinationPhoneNumber = adminNumber[1];
    //     USSD = `*131*${destinationPhoneNumber}*${amountToSell}*${sharePin}#`;
    //     break;

    //   case '9MOBILE':
    //     destinationPhoneNumber = adminNumber[2];
    //     USSD = `*223*${sharePin}*${amountToSell}*${destinationPhoneNumber}#`;
    //     break;

    //   case 'AIRTEL':
    //     destinationPhoneNumber = adminNumber[3];
    //     USSD = `*432*${destinationPhoneNumber}*${amountToSell}*${sharePin}#`;
    //     break;

    //   default:
    //     res.status(400).json({ message: 'Please select a network' });
    //     break;
    // }
    // const amountToRecieve = 0.7 * amountToSell;

    const transaction = await TransactionInstance.create({
      id,
      network,
      phoneNumber,
      amountToSell,
      amountToReceive: Math.ceil(amountToSell * 0.7),
      userId,
    });

    if (!transaction) {
      return res.status(404).json({ msg: 'Sorry, transaction was not successful!' });
    }

    return res.status(201).json({msg:"transfer successful", transaction});
  } catch (err) {
    console.log(err);
  }
}



