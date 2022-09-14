import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';
import { userSchema, loginSchema, generateToken, options } from '../utility/utils';
import { UserInstance } from '../model/userModel';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const jwtSecret = process.env.JWT_SECRET as string;
const fromUser = process.env.POD_GMAIL as string;
import mailer from '../mailer/SendMail';
import { emailVerificationView } from '../mailer/EmailTemplate';


//User Sign up
export async function registerUser(req: Request, res: Response, next: NextFunction) {
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
    const record = await UserInstance.create({
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
    if(record){
      const user = await UserInstance.findOne({where: {email: req.body.email }});
      const token = jwt.sign({id}, jwtSecret, {expiresIn: "30mins"})
      const html =  emailVerificationView(token)

      await mailer.sendEmail(
        fromUser, req.body.email, "please verify your email", html
      )

      res.status(201).json({
        msg: 'User created successfully',
        record,
      });
    }
    else{
      res.status(403).json({ msg:'failed to create user', record });
    }
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
        user
      });
    }

    return res.status(400).json({
      msg: 'Invalid credentials',
    });
  } catch (err) {
    console.error(err)
    res.status(500).json({
      msg: 'failed to authenticate',
      route: '/login',
    });
  }
}
export async function verifyUser(
  req: Request,
  res: Response,
) {
  res.send("VERIFIED!!!")
}
