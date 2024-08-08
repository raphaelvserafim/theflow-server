import { Login, Register, UpdatedPassword } from "@app/models/Auth";
import { ServiceAuth } from "@app/services/Auth";
import { BodyParams, Controller, Post } from "@tsed/common";
import { Description, Name, Put } from "@tsed/schema";

@Controller('/auth')
@Name("AuthController")
export class AuthController {

  @Post("/login")
  @Description("Authenticates a user using their login credentials.")
  async Auth(@BodyParams() data: Login) {
    return ServiceAuth.login(data);
  }

  @Post("/register")
  @Description("Registers a new user with the provided details.")
  async Register(@BodyParams() data: Register) {
    return ServiceAuth.register(data);
  }

  @Post("/password")
  @Description("Requests a verification code to reset the user's password.")
  async RequestNewPassword(@BodyParams("email") email: string) {
    return ServiceAuth.requestNewPassword(email);
  }

  @Put("/password")
  @Description("Updates the user's password using the verification code.")
  async UpdatePassword(@BodyParams() data: UpdatedPassword) {
    return ServiceAuth.updatePassword(data);
  }
}
