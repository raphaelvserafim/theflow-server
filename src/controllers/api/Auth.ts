import { Login, Register, UpdatedPassword } from "@app/models/Auth";
import { ServiceAuth } from "@app/services/Auth";
import { BodyParams, Controller, Post } from "@tsed/common";
import { Description } from "@tsed/schema";

@Controller('/auth')
export class AuthController {

  @Post("/login")
  @Description("Endpoint para autenticação de login")
  async Auth(@BodyParams() data: Login) {
    return await ServiceAuth.login(data);
  }

  @Post("/register")
  @Description("Endpoint para criar uma conta")
  async Register(@BodyParams() data: Register) {
    return await ServiceAuth.register(data);
  }

  @Post("/password/request")
  @Description("Endpoint para solicitar codigo redefinir senha")
  async RequestNewPassword(@BodyParams("email") email: string) {
    return await ServiceAuth.requestNewPassword(email);
  }

  @Post("/password/update")
  @Description("Endpoint para salvar nova senha")
  async UpdatePassword(@BodyParams() data: UpdatedPassword,) {
    return await ServiceAuth.updatePassword(data);
  }

}
