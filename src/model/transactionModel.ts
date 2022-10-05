import { DataTypes, Model } from 'sequelize';
import db from '../db/database.config';
import { UserInstance } from './userModel';


interface TransactionAttributes {
  id: string;
  network: string;
  userId: string;
  amountToSell: number;
  amountToReceive: number;
  phoneNumber: string;
  status: boolean;

}

export class TransactionInstance extends Model<TransactionAttributes> { }

TransactionInstance.init(
  {
    id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    network: {
      type: DataTypes.STRING,
      allowNull: false
    },
    amountToSell: {
      type: DataTypes.NUMBER,
      allowNull: false,

    },
    amountToReceive: {
      type: DataTypes.NUMBER,
      allowNull: false,

    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },

    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    userId: {
      type: DataTypes.UUIDV4,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    tableName: 'transactions'
  }
);


UserInstance.hasMany(TransactionInstance, { foreignKey: "user", as: "transfers" });
TransactionInstance.belongsTo(UserInstance, { foreignKey: "user", as: "customer" });
