import { DataTypes, Model, Sequelize } from 'sequelize';
import { FlowAttributes, } from '@app/models/Db';
import { DB, Users } from "@app/database";


class Flow extends Model<FlowAttributes> implements FlowAttributes {
  public id!: number;
  public userId: number;
  public code: string;
  public name: string;
  public date_creation: Date;

  public static initialize(sequelize: Sequelize) {
    Flow.init(
      {
        id: {
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
        },
        code: {
          type: DataTypes.STRING(25),
          allowNull: false,
          unique: true,
        },
        userId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          references: {
            model: Users,
            key: 'id'
          }
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false
        },
        date_creation: {
          type: DataTypes.DATE,
        }
      },
      {
        sequelize,
        tableName: 'flow',
        timestamps: false
      }
    );
    Flow.belongsTo(Users, { foreignKey: 'userId' });
  }
}

Flow.initialize(DB.getInstance());

export { Flow };
