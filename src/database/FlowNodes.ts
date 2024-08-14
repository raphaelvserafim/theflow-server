import { DataTypes, Model, Sequelize } from 'sequelize';
import { FlowNodesAttributes } from '@app/models/Db';
import { DB, Flow } from "@app/database";

class FlowNodes extends Model<FlowNodesAttributes> implements FlowNodesAttributes {
  public id!: number;
  public flowId!: number;
  public position_x!: number;
  public position_y!: number;
  public type!: string;
  public data!: string;

  public static initialize(sequelize: Sequelize) {
    FlowNodes.init(
      {
        id: {
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        flowId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          references: {
            model: Flow,
            key: 'id',
          },
        },
        position_x: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
        position_y: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
        type: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        data: {
          type: DataTypes.JSON,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'flow_nodes',
        timestamps: false,
      }
    );


    FlowNodes.belongsTo(Flow, { foreignKey: 'flowId' });
  }
}

FlowNodes.initialize(DB.getInstance());

export { FlowNodes };
