import Joi from 'joi';
import jwt from 'jsonwebtoken';


//Joi validation options
export const options = {
  abortEarly: false,
  errors: {
    wrap: {
      label: '',
    },
  },
};


//User Sign up schema
export const userSchema = Joi.object().keys({
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  username: Joi.string().required(),
  email: Joi.string().trim().lowercase().required(),
  phonenumber: Joi.string().regex(/^[0-9]{11}$/).required(),
  password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
  confirm_password: Joi.ref('password')
}).with('password', 'confirm_password');


//update User profile
export const updateUserSchema = Joi.object().keys({
  firstname:Joi.string(),
  lastname:Joi.string(),
  username:Joi.string(),
  email:Joi.string().trim(),
  phonenumber:Joi.string().regex(/^[a-zA-Z0-9]{11}$/),
  avatar:Joi.string()
});


//Token Generator function for login sessions
export const generateToken = (user: { [key: string]: unknown }): unknown => {
  const pass = process.env.JWT_SECRET as string;
  return jwt.sign(user, pass, { expiresIn: '7d' });
};

