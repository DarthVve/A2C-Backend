import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';
import { registerSchema, loginSchema, generateToken, options } from '../utility/utils';
import { UserInstance } from '../model/userModel';
import bcrypt from 'bcryptjs';

export async function RegisterUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const id = uuidv4();
  try {
    const validationResult = registerSchema.validate(req.body, options);
    if (validationResult.error) {
      return res.status(400).json({
        Error: validationResult.error.details[0].message,
      });
    }
    const duplicatEmail = await UserInstance.findOne({
      where: { email: req.body.email },
    });
    if (duplicatEmail) {
      return res.status(409).json({
        msg: 'Email is used, please change email',
      });
    }

    const passwordHash = await bcrypt.hash(req.body.password, 8);
    const record = await UserInstance.create({
      id: id,
      email: req.body.email,
      password: passwordHash,
    });
    res.status(201).json({
      msg: 'You have successfully created a user',
      record,
    });
  } catch (err) {
    res.status(500).json({
      msg: 'failed to register',
      route: '/register',
    });
  }
}

export async function loginUser(req: Request, res: Response) {
  try {
    const validationResult = loginSchema.validate(req.body, options);
    if (validationResult.error) {
      return res.status(400).json({
        Error: validationResult.error.details[0].message,
      });
    }
    const users = await UserInstance.findAll({
      where: {
        [Op.or]: [
          { email: req.body.emailOrUsername },
          { username: req.body.emailOrUsername }
        ]
      },
    });

    if (!users[0]) {
      return res.status(400).json({
        msg: 'Invalid credentials',
      });
    }

    const noMatch = await users.every(async (user: UserInstance) => {
      const isMatch = await bcrypt.compare(req.body.password, user.getDataValue('password'));
      if (isMatch)
      {
        const id = user.getDataValue('id')
        const token = generateToken({ id }) as string;
        const production = process.env.NODE_ENV === "production";
        req.headers.authorization = token;
        res.setHeader('WWW-Authenticate', 'Bearer');
        res.status(200).cookie("token", token, {
          maxAge: 7 * 24 * 60 * 60 * 1000,
          httpOnly: true,
          secure: production,
          sameSite: production ? "none" : "lax"
        }).json({
          msg: 'You have successfully logged in'
        });
        return false;
      } else return true;
    });

    if (noMatch) {
      return res.status(400).json({
        msg: 'Invalid credentials',
      });
    }
  } catch (err) {
    res.status(500).json({
      msg: 'failed to authenticate',
      route: '/login',
    });
  }
}
