import { Request, Response } from 'express';
import { UserInstance } from '../model/userModel';
import { walletNotification } from '../mailer/walletTemplate';
import mailer from '../mailer/SendMail'
const APP_EMAIL = process.env.POD_GMAIL as string;

//Update Wallet
export const creditWallet = async (req: Request, res: Response) => {
  try {
    const { amount, email } = req.body;
    const user = await UserInstance.findOne({ where: { email } });
    const wallet = user?.getDataValue('wallet');
    const updatedWallet = wallet + amount;

    if (!user) {
      return res.status(400).json({ message: 'invalid user' });
    }

    const updatedAmount = await user?.update({ wallet: updatedWallet });

    if (updatedAmount) {
      const html = walletNotification(updatedWallet, amount);
      await mailer.sendEmail(
        APP_EMAIL,
        req.body.email,
        'Wallet successfully credited',
        html
      );
    }
    return res.status(200).json({
      msg: 'Wallet credited successfully',
      data: updatedWallet
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'failed to update wallet', route: '/user/wallet' });
  }
};


