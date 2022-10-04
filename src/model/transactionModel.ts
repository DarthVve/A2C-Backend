import { DataTypes, Model } from 'sequelize';
import db from '../db/database.config';


interface TransactionAttributes {
  id:string;
  network:string;
  userId: string;
  amountTransfered: string;
  amountRecieved: number;
  phone:string;
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
    network:{
      type:DataTypes.STRING,
      allowNull:false
    },
    amountTransfered: {
      type: DataTypes.NUMBER,
      allowNull: false,

    },
    amountRecieved: {
      type: DataTypes.NUMBER,
      allowNull: false,

    },
    phone:{
      type:DataTypes.STRING,
      allowNull:false
    },

    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue:false,
    },
    userId: {
        type: DataTypes.UUIDV4,
        allowNull: false,
      },
  },
  {
    sequelize: db,
    tableName: 'transactiontable'
  }
);
