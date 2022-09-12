import { DataTypes, Model } from 'sequelize';
import db from '../db/database.config';

interface UsersAttributes {
  id: string;
  email: string;
  password: string;
}

export class UserInstance extends Model<UsersAttributes> {}

UserInstance.init(
  {
    id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          msg: 'email is required',
        },
        isEmail: {
          msg: 'Please provide a a valid Email',
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'password is required',
        },
        notEmpty: {
          msg: 'Please provide a password',
        },
      },
    },
  },
  {
    sequelize: db,
    tableName: 'usertable',
  },
);
