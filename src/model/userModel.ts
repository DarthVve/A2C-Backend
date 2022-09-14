import { DataTypes, Model } from 'sequelize';
import db from '../db/database.config';


interface UsersAttributes {
  id: string;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  phonenumber: string
  password: string;
  avatar: string;
  verified: boolean;
}

export class UserInstance extends Model<UsersAttributes> { }

UserInstance.init(
  {
    id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Enter your firstname'
        },
        notEmpty: {
          msg: 'Please provide a firstname'
        }
      }
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Enter your lastname'
        },
        notEmpty: {
          msg: 'Please provide a lastname'
        }
      }
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          msg: 'Enter a username'
        },
        notEmpty: {
          msg: 'Please provide a username'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          msg: 'email is required'
        },
        isEmail: {
          msg: 'Please provide a a valid Email'
        }
      }
    },
    phonenumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          msg: 'Phone Number is required'
        },
        notEmpty: {
          msg: 'Please provide a a valid Phone Number'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'password is required'
        },
        notEmpty: {
          msg: 'Please provide a password'
        }
      }
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true
    },
    verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  },
  {
    sequelize: db,
    tableName: 'usertable'
  }
);
