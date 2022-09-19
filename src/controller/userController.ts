import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';
import { userSchema, loginSchema, generateToken, options, updateUserSchema } from '../utility/utils';
import { UserInstance } from '../model/userModel';
import bcrypt from 'bcryptjs';
import mailer from '../mailer/SendMail';
import { emailVerificationView, passwordMailTemplate } from '../mailer/EmailTemplate';
import { deleteImg, uploadImg } from '../cloud/config';
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
      const verifyContext = await bcrypt.hash(passwordHash, 8);
      const verifyToken = generateToken({ reset: verifyContext }, '1d');
      const html = emailVerificationView(id, verifyToken)

      await mailer.sendEmail(appEmail, req.body.email, "please verify your email", html);
      return res.status(201).json({ msg: `User created successfully, welcome ${req.body.username} your id is ${id}` });
    }
    else {
      return res.status(403).json({ msg: 'Verification mail failed to send' });
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
      return res.status(400).json({ Error: validationResult.error.details[0].message });
    }
    const user = await UserInstance.findOne({
      where: {
        [Op.or]: [
          { email: req.body.emailOrUsername },
          { username: req.body.emailOrUsername }
        ]
      }
    });

    if (!user) { return res.status(404).json({ msg: 'User not found' }) };

    const isMatch = await bcrypt.compare(req.body.password, user.getDataValue('password'));
    if (isMatch) {
      if (!user.getDataValue('verified')) {
        return res.status(401).json({ msg: 'Your account has not been verified' });
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
    const { id } = req.params;
    const user = await UserInstance.findOne({ where: { id: id } });

    if (user) {
      const updateVerified = await user.update({ verified: true });
      if (updateVerified) {
        return res.status(200).json({ msg: 'User verified', updateVerified })
      } else {
        throw new Error('failed to update user')
      }
    } else {
      return res.status(404).json({ msg: 'Verification failed: User not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'failed to verify', route: 'verify/id' });
  }
};


//Password Reset, Sends an email
export async function forgetPassword(req: Request, res: Response) {
  try {
    const { email } = req.body
    const user = await UserInstance.findOne({ where: { email: email } }) as unknown as { [key: string]: string } as any

    if (user) {
      const id = user.getDataValue('id');
      const resetContext = await bcrypt.hash(user.getDataValue('password'), 8);
      const resetToken = generateToken({ reset: resetContext }, '10m');
      const html = passwordMailTemplate(id, resetToken);
      const subject = "New Account Password";
      await mailer.sendEmail("AirtimeToCash", email, subject, html);
      return res.status(200).json({ msg: "email for password reset sent" });
    } else {
      return res.status(400).json({ msg: "invalid email Address" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to send password', route: '/forgetPassword' });
  }
};


//Creates a token for authentication
export async function setResetToken(req: Request, res: Response) {
  try {
    const { token } = req.body;
    const production = process.env.NODE_ENV === "production";
    res.cookie('reset', token, {
      maxAge: 10 * 60 * 1000,
      httpOnly: true,
      secure: production,
      sameSite: production ? "none" : "lax"
    }).send(token)
    //remember to redirect to reset form
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to set reset token', route: '/resetPassword' });
  }
}


//User password update
export async function resetPassword(req: Request, res: Response) {
  try {
    const { id } = req.params
    const { password } = req.body
    const user = await UserInstance.findOne({ where: { id: id } })
    if (user) {
      const passwordHash = await bcrypt.hash(password, 8)
      let updatePassword = await user.update({ password: passwordHash });

      if (updatePassword) {
        return res.status(200).json({ msg: "password successfully updated" });
      } else {
        return res.status(400).json({ msg: "failed to update password" });
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to reset password', route: '/resetPassword' });
  }
};


//User Profile Update
export async function updateUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const validationResult = updateUserSchema.validate(req.body, options);
    if (validationResult.error) {
      return res.status(400).json({ Error: validationResult.error.details[0].message });
    }

    const { id } = req.params
    const record = await UserInstance.findOne({ where: { id } })
    if (!record) {
      return res.status(404).json({ Error: "Cannot find existing user" })
    }

    let avatar: string = '', temp: string = '';
    if (req.body.avatar) {
      const previousValue = record.getDataValue("avatar");

      if (!!previousValue) { temp = previousValue };

      avatar = await uploadImg(req.body.avatar) as string;
      if (!avatar) { throw new Error('Avatar failed to upload') };
    }

    const { firstname, lastname, phonenumber } = req.body;
    const updatedrecord = await record.update({
      firstname,
      lastname,
      phonenumber,
      avatar
    });

    if (temp) { await deleteImg(temp) };

    return res.status(200).json({
      msg: "You have successfully updated your profile",
      updatedrecord
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "failed to update", route: "/update/:id" });
  }
};

export async function getSingleUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;

    const record = await UserInstance.findOne({ where: { id } });

    if (!record) {
      return res.status(500).json({ message: 'Invalid ID' });
    }

    return res.status(202).json({
      message: 'User successfully fetched',
      record,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to get',
      route: '/getOne',
    });
  }
}

//Logout User
export async function logoutUser(req: Request, res: Response, next: NextFunction) {
  try {
    res.clearCookie('token');
    res.status(200).json({ msg: 'You have successfully logged out' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'failed to logout', route: '/logout' });
  }
}
