import * as EmailValidator from 'email-validator';
import { NAME_TABLE_DB } from "../constants";
import { Login, Register, UpdatedPassword } from "../models/Auth";
import { Functions } from "../functions";
import { User } from "./User";
import { Mail } from "./Mail";

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
      const response = await User.byEmail(data.email);
      if (response && response.length > 0) {
        const user = response[0];
        const validPassword = await Functions.comparePasswords(data.password, user.user_password);
        if (!validPassword) {
          throw new Error("invalid password");
        }
        const token = Functions.generateRandomToken(20);
        await this.saveSession(user.user_id, token);
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

      if (!EmailValidator.validate(data.email)) {
        throw new Error("Invalid email");
      }
      if (!data.password) {
        throw new Error("enter password first");
      }

      const response = await User.byEmail(data.email);
      if (response && response.length > 0) {
        throw new Error("an account already uses this email");
      }
      const user = await User.save(data);
      if (user.insertId) {
        const token = Functions.generateRandomToken(20);
        await this.saveSession(user.insertId, token);
        return { status: 200, session: token };
      } else {
        throw new Error("Error saving to DB");
      }
    } catch (error) {
      return { status: 500, message: error.message };
    }
  }


  /**
   *  Faz logout 
   * @param session token da sessao
   * @returns status e mensagem 
   */
  static async logout(session: string): Promise<{ status: number; message: string; }> {
    try {
      const response = await this.updateStatusSession(session, 2);
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
  static async requestNewPassword(email: string): Promise<{ status: number; message: string; }> {
    try {
      const db = global.database;
      const response = await User.byEmail(email);
      if (response && response.length === 0) {
        throw new Error("Email not found");
      }
      const user = response[0];
      const code = Functions.generateRandomNumbers(5);
      const valid = await db.select(NAME_TABLE_DB.NEW_PASSWORD.NAME, [user.user_id, 1], [NAME_TABLE_DB.NEW_PASSWORD.COLUMNS.USER + " = ?", NAME_TABLE_DB.NEW_PASSWORD.COLUMNS.STATUS + " = ?"]);
      if (valid && valid.length > 0) {
        throw new Error("you already have an open request, check your email");
      }
      const data = {
        [NAME_TABLE_DB.NEW_PASSWORD.COLUMNS.USER]: user.user_id,
        [NAME_TABLE_DB.NEW_PASSWORD.COLUMNS.TOKEN]: code,
        [NAME_TABLE_DB.NEW_PASSWORD.COLUMNS.DATE]: new Date(),
        [NAME_TABLE_DB.NEW_PASSWORD.COLUMNS.STATUS]: 1
      };
      await db.insert(NAME_TABLE_DB.NEW_PASSWORD.NAME, data);

      await Mail.sendCodeNewPassword(email, user.user_name, String(code));
      return { status: 200, message: "Code to reset password sent to your email" };
    } catch (error) {
      return { status: 500, message: error.message };
    }
  }


  /**
   * Atualizando senha
   * @param code 
   * @param password 
   * @returns 
   */
  static async updatePassword(data: UpdatedPassword): Promise<{ status: number; message: string; }> {
    try {
      const { code, password } = data;
      const db = global.database;
      const valid = await db.select(NAME_TABLE_DB.NEW_PASSWORD.NAME, [code, 1], [NAME_TABLE_DB.NEW_PASSWORD.COLUMNS.TOKEN + " = ?", NAME_TABLE_DB.NEW_PASSWORD.COLUMNS.STATUS + " = ?"]);
      if (valid && valid.length === 0) {
        throw new Error("code not found or expired");
      }
      const user_id = valid[0].user;
      const response = await User.updatePassword(password, user_id);
      if (response === 0) {
        throw new Error("Error updating password");
      }
      await db.update(NAME_TABLE_DB.NEW_PASSWORD.NAME, { [NAME_TABLE_DB.NEW_PASSWORD.COLUMNS.STATUS]: 2 }, [NAME_TABLE_DB.NEW_PASSWORD.COLUMNS.TOKEN + "="], [code]);
      return { status: 200, message: "Updated successfully" };
    } catch (error) {
      return { status: 500, message: error.message };
    }
  }

  /**
   * Atulizar status da sessao
   * @param session 
   * @param status 
   * @returns 
   */
  static async updateStatusSession(session: string, status: number): Promise<any> {
    try {
      const db = global.database;
      return await db.update(NAME_TABLE_DB.SESSION.NAME, { [NAME_TABLE_DB.SESSION.COLUMNS.STATUS]: status }, [NAME_TABLE_DB.SESSION.COLUMNS.TOKEN + "="], [session]);
    } catch (error) {
      throw error;
    }
  }


  /**
   * Salvando nova sessao
   * @param user 
   * @param token 
   * @returns 
   */
  static async saveSession(user: number, token: string,): Promise<any> {
    try {
      const db = global.database;
      const data = {
        [NAME_TABLE_DB.SESSION.COLUMNS.USER]: user,
        [NAME_TABLE_DB.SESSION.COLUMNS.TOKEN]: token,
        [NAME_TABLE_DB.SESSION.COLUMNS.DATE]: new Date(),
        [NAME_TABLE_DB.SESSION.COLUMNS.STATUS]: 1
      };
      return await db.insert(NAME_TABLE_DB.SESSION.NAME, data);
    } catch (error) {
      throw error;
    }
  }
}
