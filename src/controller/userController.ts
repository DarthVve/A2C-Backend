import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';
import { userSchema, loginSchema, generateToken, options } from '../utility/utils';
import { UserInstance } from '../model/userModel';
import bcrypt from 'bcryptjs';
import mailer from '../mailer/SendMail';
import { emailVerificationView, passwordMailTemplate } from '../mailer/EmailTemplate';
const appEmail = process.env.POD_GMAIL as string;


//User Sign up
export async function registerUser(req: Request, res: Response) {
  try {
    const id = uuidv4();
    const validationResult = userSchema.validate(req.body, options);

    if (validationResult.error) {
      return res.status(400).json({ Error: validationResult.error.details[0].message });
    }

    const duplicate = await UserInstance.findOne({
      where: {
        [Op.or]: [
          { username: req.body.username },
          { email: req.body.email },
          { phonenumber: req.body.phonenumber }
        ]
      }
    });

    if (duplicate) {
      return res.status(409).json({ msg: 'Enter a unique username, email, or phonenumber' });
    }

    const passwordHash = await bcrypt.hash(req.body.password, 8);
    const user = await UserInstance.create({
      id: id,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      username: req.body.username,
      email: req.body.email,
      phonenumber: req.body.phonenumber,
      password: passwordHash,
      avatar: '',
      verified: false
    });

    if (user) {
      const html =  emailVerificationView(id)

      await mailer.sendEmail(
        appEmail, req.body.email, "please verify your email", html
      )
    }
    else{
      res.status(403).json({ msg:'Verification mail failed to send', user });
    }
    res.status(201).json({ msg: 'User created successfully' });
  } catch (err) {
    console.error(err)
    res.status(500).json({ msg: 'failed to register', route: '/register' });
  }
};


//User Login
export async function loginUser(req: Request, res: Response) {
  try {
    const validationResult = loginSchema.validate(req.body, options);
    if (validationResult.error) {
      return res.status(400).json({ Error: validationResult.error.details[0].message});
    }
    const user = await UserInstance.findOne({
      where: {
        [Op.or]: [
          { email: req.body.emailOrUsername },
          { username: req.body.emailOrUsername }
        ]
      }
    });

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.getDataValue('password'));
    if (isMatch) {
      if (!user.getDataValue('verified')) {
        return res.status(401).json({
          msg: 'Your account has not been verified',
        });
      }

      const id = user.getDataValue('id')
      const token = generateToken({ id }) as string;
      const production = process.env.NODE_ENV === "production";

      return res.status(200).cookie("token", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: production,
        sameSite: production ? "none" : "lax"
      }).json({
        msg: 'You have successfully logged in',
        token,
        id
      });
    } else {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ msg: 'failed to authenticate', route: '/login' });
  }
};


//Verify User
export async function verifyUser(req: Request, res: Response) {
  try {
    const {id} = req.params;
    const user = await UserInstance.findOne({where: {id: id}});

    if (user) {
      const updateVerified = await user.update({
        verified:true
      })
      if(updateVerified){
        res.status(200).json({ msg:'User verified', updateVerified })
      }
    } else {
      res.status(404).json({ msg:'Verification failed' });
    }
    
  } catch (err) {
  console.error(err);
  res.status(500).json({ message: 'not verified', route: 'verify/id' });
  }
}


//Password Reset, Sends an email 
export async function forgetPassword ( req: Request, res: Response ) {
  try {
      const { email } = req.body
      const user = await UserInstance.findOne({where:{email:email}}) as unknown as {[key:string]:string} as any
     
      if (user) {
        const { id } = user;
        const html = passwordMailTemplate(id);
        const subject = "New Account Password";
        await mailer.sendEmail("AirtimeToCash", email, subject, html);
        res.status(200).json({ msg:"new password sent" });
      } else {
          res.status(400).json({msg:"invalid email Address"});
      }
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to send password', route: '/forgetPassword' });
  }
}


//User password update
export async function resetPassword(req:Request, res:Response) {
  try {
      const { id } = req.params
      const { password } = req.body
      const user = await UserInstance.findOne({ where: { id: id } }) 
      if (user) {
          const passwordHash = await bcrypt.hash(password, 8)
          let updatePassword = await user.update({ password:passwordHash });

          if (updatePassword) {
            res.status(200).json({ msg:"password successfully updated" });
          } else {
            res.status(400).json({ msg:"failed to update password" });
          }
      }
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to reset password', route: '/resetPassword' });
  }
};
  

