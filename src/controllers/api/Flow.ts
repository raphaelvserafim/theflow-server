import { Authenticated } from "@app/middlewares";
import { FlowEdgesAttributes } from "@app/models/Db";
import { flowConnectEdges, flowCreate, flowSaveNodes, flowUpdateContentNodes, flowUpdatePositionNodes } from "@app/models/Flow";
import { ServiceFlow } from "@app/services";
import { BodyParams, Context, Controller, HeaderParams, PathParams, Post, Req, UseBefore } from "@tsed/common";
import { Delete, Get, Name, Put, Required, Summary } from "@tsed/schema";
import { Request } from "@tsed/common";

import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });


@Controller('/flow')
@Name("Flow Editor")
export class FlowController {

  @Post()
  @UseBefore(Authenticated)
  @Summary("Creates a new flow in the system.")
  async create(
    @Required() @HeaderParams("Authorization") authorization: string,
    @Context() context: Context,
    @BodyParams() data: flowCreate) {
    const user = context.get('authenticated') as { user: number };
    return ServiceFlow.create(data, user.user);
  }

  @Get("/:code")
  @UseBefore(Authenticated)
  @Summary("Retrieves information about a specific flow using its ID.")
  async getInfo(
    @Required() @HeaderParams("Authorization") authorization: string,
    @Context() context: Context,
    @PathParams("code") code: string
  ) {
    return ServiceFlow.info(code);
  }



  @Put("/:code")
  @Summary("Updates the details of an existing flow by its ID.")
  async update() {

  }

  @Delete("/:code")
  @Summary("Deletes a flow from the system using its ID.")
  async delete() {

  }

  @Post("/:code/nodes")
  @Summary("Saves new nodes to a specific flow.")
  async saveNodes(
    @Required() @HeaderParams("Authorization") authorization: string,
    @Context() context: Context,
    @PathParams("code") code: string,
    @BodyParams() data: flowSaveNodes) {
    return ServiceFlow.saveNodes(data, code);
  }

  @Put("/:code/nodes/:code_node")
  @Summary("Updates position a specific node within a flow.")
  async updateNodes(
    @Required() @HeaderParams("Authorization") authorization: string,
    @Context() context: Context,
    @PathParams("code") code: string,
    @PathParams("code_node") code_node: string,
    @BodyParams() data: flowUpdatePositionNodes) {
    return ServiceFlow.updatePositionNodes(data, code_node);
  }

  @Put("/:code/nodes/:code_node/content")
  @UseBefore(upload.single('file'))
  @Summary("Updates content a specific node within a flow.")
  async updateContentNodes(
    @Required() @HeaderParams("Authorization") authorization: string,
    @Context() context: Context,
    @PathParams("code") code: string,
    @PathParams("code_node") code_node: string,
    @Req() request: Request,
    @BodyParams() data: flowUpdateContentNodes) {
    return ServiceFlow.updateContentNodes(data, request, code_node);
  }


  @Delete("/:code/nodes/:code_node")
  @Summary("Deletes a specific node from a flow.")
  async deleteNodes(
    @Required() @HeaderParams("Authorization") authorization: string,
    @Context() context: Context,
    @PathParams("code") code: string,
    @PathParams("code_node") code_node: string,) {
    return ServiceFlow.deleteNodes(code_node);
  }


  @Post("/:code/edges")
  @Summary("Retrieves all edges associated with a specific flow.")
  async connectEdges(
    @Required() @HeaderParams("Authorization") authorization: string,
    @Context() context: Context,
    @PathParams("code") code: string,
    @BodyParams() data: flowConnectEdges
  ) {
    return ServiceFlow.connectEdges(code, data);
  }

  @Delete("/:code/edges/:source/:target")
  @Summary("Retrieves all edges associated with a specific flow.")
  async deleteEdges(
    @Required() @HeaderParams("Authorization") authorization: string,
    @Context() context: Context,
    @PathParams("code") code: string,
    @PathParams("source") source: string,
    @PathParams("target") target: string,
  ) {
    return ServiceFlow.deleteEdges(code, source, target);
  }


}
