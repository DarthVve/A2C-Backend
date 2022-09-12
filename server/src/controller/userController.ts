import express, { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { registerSchema, options } from '../utility/utils';
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
