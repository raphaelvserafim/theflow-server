import { DataTypes, Model, Sequelize } from 'sequelize';
import { FlowEdgesAttributes } from '@app/models/Db';
import { DB, Flow, FlowNodes } from "@app/database";

class FlowEdges extends Model<FlowEdgesAttributes> implements FlowEdgesAttributes {
  public id!: number;
  public flowId!: number;
  public source: string;
  public target: string;

  public static initialize(sequelize: Sequelize) {
    FlowEdges.init(
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
            model: 'flow',
            key: 'id',
          },
        },
        source: {
          type: DataTypes.STRING,
          allowNull: false,
          references: {
            model: FlowNodes,
            key: 'id',
          },
        },
        target: {
          type: DataTypes.STRING,
          allowNull: false,
          references: {
            model: FlowNodes,
            key: 'id',
          },
        },
      },
      {
        sequelize,
        tableName: 'flow_edges',
        timestamps: false,
      }
    );

    FlowEdges.belongsTo(Flow, { foreignKey: 'flowId' });
    FlowEdges.belongsTo(FlowNodes, { as: 'sourceNode', foreignKey: 'source' });
    FlowEdges.belongsTo(FlowNodes, { as: 'targetNode', foreignKey: 'target' });
  }
}

FlowEdges.initialize(DB.getInstance());

export { FlowEdges };
