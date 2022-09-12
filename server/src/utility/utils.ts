import Joi from 'joi';
import jwt from 'jsonwebtoken';

export const registerSchema = Joi.object()
  .keys({
    email: Joi.string().trim().lowercase().required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
    confirm_password: Joi.ref('password'),
  })
  .with('password', 'confirm_password');

export const generateToken = (user: { [key: string]: unknown }): unknown => {
  const pass = process.env.JWT_SECRET as string;
  return jwt.sign(user, pass, { expiresIn: '7d' });
};

export const options = {
  abortEarly: false,
  errors: {
    wrap: {
      label: '',
    },
  },
};
