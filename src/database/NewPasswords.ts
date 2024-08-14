import { DataTypes, Model, Sequelize } from 'sequelize';
import { NewPasswordsAttributes } from '@app/models/Db';
import { DB } from "@app/database";
import { Users } from './Users';

class NewPasswords extends Model<NewPasswordsAttributes> implements NewPasswordsAttributes {
  public id!: number;
  public userId!: number;
  public token!: string;
  public status!: boolean;
  public expire!: Date;

  public static initialize(sequelize: Sequelize) {
    NewPasswords.init(
      {
        id: {
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        userId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          references: {
            model: Users,
            key: 'id',
          },
        },
        token: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        expire: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        status: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
      },
      {
        sequelize,
        tableName: 'new_passwords',
        timestamps: false,
      }
    );

    NewPasswords.belongsTo(Users, { foreignKey: 'userId' });
  }
}

NewPasswords.initialize(DB.getInstance());

export { NewPasswords };
