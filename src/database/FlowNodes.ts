import { DataTypes, Model, Sequelize } from 'sequelize';
import { FlowNodesAttributes } from '@app/models/Db';
import { DB, Flow } from "@app/database";

class FlowNodes extends Model<FlowNodesAttributes> implements FlowNodesAttributes {
  public id: string;
  public flowId!: number;
  public position!: string;
  public type!: string;
  public data!: string;

  public static initialize(sequelize: Sequelize) {
    FlowNodes.init(
      {
        id: {
          type: DataTypes.STRING(50),
          allowNull: false,
          primaryKey: true,
          unique: true,
        },
        flowId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          references: {
            model: Flow,
            key: 'id',
          },
        },
        position: {
          type: DataTypes.JSON,
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
