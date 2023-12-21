import { Auth } from "../models/Auth";
import { ServiceAuth } from "../services/Auth";
import { BodyParams, Controller, Post, Description } from "@tsed/common";

@Controller('/auth')
export class AuthController {
  
  @Post("/login")
  @Description("Endpoint para autenticação de login")
  async Auth(@BodyParams("data") data: Auth) {
    return await ServiceAuth.login(data);
  }
}
