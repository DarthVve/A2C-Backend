import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { userSchema, options } from '../utility/utils';
import { UserInstance } from '../model/userModel';
import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';

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
      avatar: req.body.avatar,
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
