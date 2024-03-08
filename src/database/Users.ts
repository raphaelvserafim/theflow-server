import { DataTypes, Model } from 'sequelize';
import { sequelize } from '.';

interface UsersAttributes {
  id?: number;
  name: string;
  email: string;
  date_registration: Date;
  password: string;
}

class Users extends Model<UsersAttributes> implements UsersAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public date_registration!: Date;
  public password!: string;
}

Users.init(
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    date_registration: {
      type: DataTypes.DATE,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'Users',
    timestamps: false
  }
);
export { Users };
