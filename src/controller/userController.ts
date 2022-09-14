import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';
import { userSchema, loginSchema, generateToken, options } from '../utility/utils';
import { UserInstance } from '../model/userModel';
import bcrypt from 'bcryptjs';

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

    res.status(201).json({
      msg: 'User created successfully',
      record
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({ msg: 'failed to register', route: '/register' });
  }
};

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

    const noMatch = users.every(async (user: UserInstance) => {
      const isMatch = await bcrypt.compare(req.body.password, user.getDataValue('password'));
      if (isMatch)
      {
        const id = user.getDataValue('id')
        const token = generateToken({ id }) as string;
        const production = process.env.NODE_ENV === "production";
        req.headers.authorization = token;
        res.header('WWW-Authenticate', 'Bearer');
        res.status(200).cookie("token", token, {
          maxAge: 7 * 24 * 60 * 60 * 1000,
          httpOnly: true,
          secure: production,
          sameSite: production ? "none" : "lax"
        }).json({
          msg: 'You have successfully logged in',
          token
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
