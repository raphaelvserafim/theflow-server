import { DataTypes, Model, Sequelize } from 'sequelize';
import { FlowNodesAttributes } from '@app/models/Db';
import { DB, Flow } from "@app/database";

class FlowNodes extends Model<FlowNodesAttributes> implements FlowNodesAttributes {
  public id: string;
  public flowId!: number;
  public position_x!: number;
  public position_y: number;
  public type!: string;
  public date_time_created!: Date;
  public text_content!: string;
  public file_content!: string;

  

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
        text_content: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        file_content: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        date_time_created: {
          type: DataTypes.DATE,
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
