import { DataTypes, Model, Sequelize } from 'sequelize';
import { UsersAttributes } from '@app/models/Db';
import { DB } from "@app/database";

class Users extends Model<UsersAttributes> implements UsersAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public date_registration!: Date;
  public password!: string;

  public static initialize(sequelize: Sequelize) {
    Users.init(
      {
        id: {
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        date_registration: {
          type: DataTypes.DATE,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'users',
        timestamps: false,
        underscored: true,
      }
    );
  }
}

Users.initialize(DB.getInstance());

export { Users };
