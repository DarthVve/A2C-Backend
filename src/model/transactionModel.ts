import { DataTypes, Model } from 'sequelize';
import db from '../db/database.config';
import { UserInstance } from './userModel';

interface TransactionAttributes {
  id: string;
  network: string;
  phoneNumber: number;
  amountToSell: number;
  amountToReceive: number;
  userId: string;
  transactionStatus?: boolean;
}

export class TransactionInstance extends Model<TransactionAttributes> {}

TransactionInstance.init(
  {
    id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    network: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    amountToSell: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    amountToReceive: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUIDV4,
      allowNull: false,
    },
    transactionStatus: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
  },
  {
    sequelize: db,
    tableName: 'Transactions',
  },
);

UserInstance.hasMany(TransactionInstance, { foreignKey: "userId", as: "transactions" });

TransactionInstance.belongsTo(UserInstance, { foreignKey: "userId", as: "sender" });
