import { Request, Response } from "express";
import { v4 as uuidv4 } from 'uuid';
import { withdrawalSchema, options } from "../utility/utils";
import { WithdrawInstance } from "../model/withdrawModel";
import { UserInstance } from '../model/userModel';
import bcrypt from 'bcryptjs';


//Create Withdrawal
export async function withdrawal(req: Request, res: Response) {
  try {
    const validationResult = withdrawalSchema.validate(req.body, options);
    if (validationResult.error) {
      return res.status(400).json({ msg: validationResult.error.details[0].message });
    }

    const id = uuidv4();
    const { bank, name, number, amount } = req.body;
    const user = await UserInstance.findOne({ where: { id: req.user } }) as UserInstance;
    const validPass = await bcrypt.compare(req.body.password, user.getDataValue('password'));
    if (!validPass) {
      return res.status(401).json({ msg: "Password should match 'password' on login" });
    }

    const withdrawal = await WithdrawInstance.create({
      id,
      bank,
      name,
      number,
      amount,
      status: 'pending',
      user: user.getDataValue('id')
    });

    return res.status(201).json({ msg: 'Processing Withdrawal' });
  } catch (error) {
    console.error(error)
    res.status(500).json({ msg: 'Withdrawal failed', route: '/withdrawal' });
  }
};


//Get a User's Withdrawals
export async function getWithdrawals(req: Request, res: Response) {
  try {
    const withdrawals = await WithdrawInstance.findAll({ where: { user: req.user } });
    if (!withdrawals.length) {
      return res.status(404).json({ msg: 'No withdrawals found' });
    }

    return res.status(200).json({
      msg: 'Here are your Withdrawals',
      withdrawals
    });
  } catch (error) {
    console.error(error)
    res.status(500).json({ msg: 'Could not get Withdrawals', route: '/withdrawal/all' });
  }
};


//Withdraw form Wallet
export async function withdraw(req: Request, res: Response) {
  try {
    // const { id } = req.params;
    // const withdrawal = await WithdrawInstance.findOne({ where: { id } }) as WithdrawInstance;
    // if (!withdrawal) {
    //   return res.status(404).json({ msg: 'Withdrawal not found' });
    // }

    // const user = await UserInstance.findOne({ where: { id: req.user } }) as UserInstance;
    // const wallet = user?.getDataValue('wallet');

    // if (wallet < withdrawal.getDataValue('amount')) {
    //   return res.status(400).json({ msg: 'Insufficient funds' });
    // }

    // const newWallet = wallet - withdrawal.getDataValue('amount');
    // await user.update({ wallet: newWallet });

    // await withdrawal.update({ status: 'completed' });

    // return res.status(200).json({ msg: 'Withdrawal successful' });
  } catch (error) {
    console.error(error)
    res.status(500).json({ msg: 'failed to get withdrawals', route: '/' });
  }
};

