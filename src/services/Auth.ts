import { NAME_TABLE_DB } from "../constants";
import { Login, Register } from "../models/Auth";
import { Functions } from "../functions";
import { User } from "./User";

export class ServiceAuth {

  /**
   * Autentica um usuário com base nas informações fornecidas.
   *
   * @param data - As informações de autenticação do usuário.
   * @returns Um objeto contendo o status da autenticação, uma possível mensagem de erro e uma sessão (se a autenticação for bem-sucedida).
   */
  static async login(data: Login): Promise<{
    status: number;
    session: string;
    message?: string;
  } | {
    status: number;
    message: string;
    session?: string;
  }> {
    try {
      const db = global.database;
      const response = await User.byEmail(data.email);
      if (response && response.length > 0) {
        const user = response[0];
        const validPassword = await Functions.comparePasswords(data.password, user.user_password);
        if (!validPassword) {
          throw new Error("invalid password");
        }
        const token = Functions.generateRandomToken(20);
        await db.insert(NAME_TABLE_DB.SESSION, { user: user.user_id, session_token: token, session_date: new Date(), session_status: 1 });
        return { status: 200, session: token };
      } else {
        throw new Error("email not found");
      }
    } catch (error) {
      return { status: 500, message: error.message };
    }
  }


  /**
   * Cria a conta do usuario
   * @param data dados de cadastro do usuario
   * @returns caso a conta seja criado com sucesso faz login e retorna status e sessao
   */
  static async register(data: Register): Promise<{
    status: number;
    session: string;
    message?: string;
  } | {
    status: number;
    message: string;
    session?: string;
  }> {
    try {

      if (!data.name) {
        throw new Error("enter name first");
      }
      if (!data.email) {
        throw new Error("enter email first");
      }
      if (!data.password) {
        throw new Error("enter password first");
      }
      const response = await User.byEmail(data.email);
      if (response && response.length > 0) {
        throw new Error("an account already uses this email");
      }
      await User.save(data);
      return await this.login({ email: data.email, password: data.password });
    } catch (error) {
      return { status: 500, message: error.message };
    }
  }


  /**
   *  Faz logout 
   * @param session token da sessao
   * @returns status e mensagem 
   */
  static async logout(session: string): Promise<{
    status: number;
    message: string;
  } | undefined> {
    try {
      const db = global.database;
      const response = await db.update(NAME_TABLE_DB.SESSION, { session_status: 0 }, ["session_token = "], [session]);
      if (response) {
        return { status: 200, message: "logout successfully" };
      } else {
        throw new Error("Error when logging out");
      }
    } catch (error) {
      return { status: 500, message: error.message };
    }
  }


  /**
   * Envia codigo para redefinir a senha da conta
   * @param email email de cadastro
   * @returns status e mensagem da situacao
   */
  static async requestNewPassword(email: string) {
    try {
      const response = await User.byEmail(email);
      if (response && response.length === 0) {
        throw new Error("Email not found");
      }

      return { status: 200, message: "Code to reset password sent to your email" };
    } catch (error) {
      return { status: 500, message: error.message };
    }
  }

}
