import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { userSchema, options, updateUserSchema } from '../utility/utils';
import { UserInstance } from '../model/userModel';

import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';
import { deleteImg, uploadImg } from '../cloud/config';

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


export async function updateUsers(req:Request, res:Response, next:NextFunction) {
  
  try{ 
    const validationResult = updateUserSchema.validate(req.body,options);
    if ( validationResult.error) {
      return res.status(400).json({ Error:validationResult.error.details[0].message });
    }

    const  {id} = req.params
    const record = await UserInstance.findOne({where: {id}})
    if (!record) {
      return res.status(404).json({
         Error:"Cannot find existing user",
      })
    }

    let avatar: string = '', temp: string = '';
    if (req.body.avatar){
      //check if already db image
      const previousValue = record.getDataValue("avatar");
      if(!!previousValue)
      {
        temp = previousValue; 
        console.log('there was some avatar before')
      }

      avatar = await uploadImg(req.body.avatar) as string;
      console.log(avatar)
      if (!avatar) {
        throw new Error();
      }
      console.log("after throw ", avatar)
    }

    const { firstname, lastname, phonenumber } = req.body; 
    const updatedrecord = await record.update({
      firstname,
      lastname,
      phonenumber,
      avatar
    });

    if(temp) {
      await deleteImg(temp);
    }

    res.status(200).json({
      msg:"You have successfully updated your profile",
      updatedrecord
    })

  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "failed to update",
      route: "/update/:id"
    })
  }

}