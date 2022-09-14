import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { userSchema, options, updateUserSchema } from '../utility/utils';
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
     const  {id} = req.params
     const {firstname,lastname,username,email,phonenumber,avatar} = req.body
     const validationResult = updateUserSchema.validate(req.body,options)
      if( validationResult.error){
         return res.status(400).json({
            Error:validationResult.error.details[0].message
         })
      } 

     const record = await UserInstance.findOne({where: {id}})
      if(!record){
        return res.status(404).json({
           Error:"Cannot find existing user",
        })
      }
      const updatedrecord = await record.update({
        firstname: firstname,
        lastname: lastname,
        username: username,
        email: email,
        phonenumber: phonenumber,
        avatar: avatar
      })
      res.status(200).json({
            msg:"You have successfully updated your profile",
           updatedrecord
          })

    }catch(error){
   res.status(500).json({
      msg:"failed to update",
      route:"/update/:id"
   })
}

}