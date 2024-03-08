import { DataTypes, Model } from 'sequelize';
import { sequelize } from '.';
import { Users } from './Users';

interface NewPasswordsAttributes {
  id?: number;
  userId: number;
  token: string;
  status: boolean;
  expire: Date;

}

class NewPasswords extends Model<NewPasswordsAttributes> implements NewPasswordsAttributes {
  public id!: number;
  public userId!: number;
  public token!: string;
  public status!: boolean;
  public expire!: Date;
}


NewPasswords.init(
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false
    },
    expire: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  },
  {
    sequelize,
    modelName: 'NewPasswords',
    timestamps: false
  }
);


NewPasswords.belongsTo(Users, { foreignKey: 'userId' });

export { NewPasswords };
