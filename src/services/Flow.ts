import { Flow, FlowEdges, FlowNodes } from "@app/database";
import { flowConnectEdges, flowCreate, flowSaveNodes, flowUpdateContentNodes, flowUpdatePositionNodes } from "@app/models/Flow";
import { Functions } from "@app/utils";
import { Request } from "@tsed/common";


export class ServiceFlow {

  static async create(data: flowCreate, userId: number) {
    try {
      const code = `${Functions.generateRandomToken(3)}-${Functions.generateRandomToken(3)}`;
      await Flow.create({ name: data.name, userId, code, date_creation: new Date });

      const _id = `${code}-${Functions.generateRandomToken(5)}`;

      await this.saveNodes({ id: _id, type: "start", position: { x: 466, y: 208 } }, code);

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

      await FlowNodes.create({ flowId: _flow?.dataValues.id, id: data.id, position_x: data.position.x, position_y: data.position.y, type: data.type, date_time_created: new Date() })

      return { status: 200, }
    } catch (error) {
      return { status: 500, message: error.message }
    }
  }


  static async updatePositionNodes(data: flowUpdatePositionNodes, id: string) {
    try {
      await FlowNodes.update({ position_x: data.position.x, position_y: data.position.y }, { where: { id } });
      return { status: 200, }
    } catch (error) {
      return { status: 500, message: error.message }
    }
  }


  static async updateContentNodes(data: flowUpdateContentNodes, request: Request, id: string) {
    try {
      if (request?.file) {
        console.log(request.file);
        const save = await Functions.uploadStorage(id, request.file);
        if (save.status) {
          await FlowNodes.update({ file_content: save.file }, { where: { id } });


        }
      }

      if (data.text_content) {
        await FlowNodes.update({ text_content: data.text_content }, { where: { id } });
      }

      return { status: 200, message: "Salvo com sucesso" }
    } catch (error) {
      return { status: 500, message: error.message }
    }
  }



  static async deleteNodes(id: string) {
    try {

      const _flow = await FlowNodes.findOne({ where: { id } });
      if (!_flow?.dataValues.id) {
        return;
      }

      await FlowEdges.destroy({ where: { target: id } });
      await FlowEdges.destroy({ where: { source: id } });

      if (_flow.dataValues.type === "start") {
        return { status: 500, message: "You can't delete the start" }
      }

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


  static async deleteEdges(code: string, source: string, target: string) {
    try {
      const _flow = await Flow.findOne({ where: { code } });
      if (!_flow?.dataValues.id) {
        return;
      }
      await FlowEdges.destroy({ where: { flowId: _flow?.dataValues.id, target, source } });
      return { status: 200, }
    } catch (error) {
      return { status: 500, message: error.message }
    }
  }

}