import { NAME_TABLE_DB } from "../constants";
import { Auth } from "../models/Auth";


export class ServiceAuth {

  /**
   * Autentica um usuário com base nas informações fornecidas.
   *
   * @param data - As informações de autenticação do usuário.
   * @returns Um objeto contendo o status da autenticação, uma possível mensagem de erro e uma sessão (se a autenticação for bem-sucedida).
   */
  static async login(data: Auth): Promise<{
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
      const response = await db.select(NAME_TABLE_DB.USER, [data.email], ["user_email = ?"]);
      if (response && response.length > 0) {
        const user = response[0];
        if (user.user_password !== data.password) {
          return { status: 400, message: 'invalid password' };
        }
        return { status: 200, session: 'acacacacacacacac' };
      } else {
        return { status: 400, message: 'email not found' };
      }
    } catch (error) {
      return { status: 500, message: error.message };
    }
  }
}
