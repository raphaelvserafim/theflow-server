import { Flow, FlowEdges, FlowNodes } from "@app/database";
import { flowConnectEdges, flowCreate, flowSaveNodes, flowUpdatePositionNodes } from "@app/models/Flow";
import { Functions } from "@app/utils";

export class ServiceFlow {

  static async create(data: flowCreate, userId: number) {
    try {
      const code = `${Functions.generateRandomToken(3)}-${Functions.generateRandomToken(3)}`;
      await Flow.create({ name: data.name, userId, code, date_creation: new Date });
      return { status: 200, code }
    } catch (error) {
      return { status: 500, message: error.message }
    }
  }


  static async info(code: string) {
    try {
      const _flow = await Flow.findOne({ where: { code } });
      if (!_flow?.dataValues.id) {
        return;
      }

      const nodes = await FlowNodes.findAll({ where: { flowId: _flow?.dataValues.id } });

      const edges = await FlowEdges.findAll({ where: { flowId: _flow?.dataValues.id } });


      return { status: 200, flow: _flow, nodes, edges }
    } catch (error) {
      return { status: 500, message: error.message }
    }
  }

  static async saveNodes(data: flowSaveNodes, code: string) {
    try {
      const _flow = await Flow.findOne({ where: { code } });
      if (!_flow?.dataValues.id) {
        return;
      }

      await FlowNodes.create({ flowId: _flow?.dataValues.id, id: data.id, position: JSON.stringify(data.position), type: data.type, data: JSON.stringify({}) })

      return { status: 200, }
    } catch (error) {
      return { status: 500, message: error.message }
    }
  }


  static async updatePositionNodes(data: flowUpdatePositionNodes, id: string) {
    try {
      await FlowNodes.update({ position: JSON.stringify(data.position) }, { where: { id } });
      return { status: 200, }
    } catch (error) {
      return { status: 500, message: error.message }
    }
  }


  static async deleteNodes(id: string) {
    try {
      await FlowEdges.destroy({ where: { target: id } });
      await FlowEdges.destroy({ where: { source: id } });
      await FlowNodes.destroy({ where: { id } });
      return { status: 200, }
    } catch (error) {
      return { status: 500, message: error.message }
    }
  }


  static async connectEdges(code: string, data: flowConnectEdges) {
    try {
      const _flow = await Flow.findOne({ where: { code } });
      if (!_flow?.dataValues.id) {
        return;
      }

      const _d = await FlowEdges.findOne({ where: { source: data.source, target: data.target } });
      
      if (!_d?.dataValues) {
        await FlowEdges.create({ flowId: _flow?.dataValues.id, source: data.source, target: data.target });

      }

      return { status: 200, }
    } catch (error) {
      return { status: 500, message: error.message }
    }
  }



}