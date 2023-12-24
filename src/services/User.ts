import { NAME_TABLE_DB } from "../constants";
import { Functions } from "../functions";
import { Register } from "../models/Auth";

export class User {

  /**
   * Buscando no banco de dados Usuario pelo E-mail
   * @param email email de cadastro do usuario
   * @returns 
   */
  static async byEmail(email: string): Promise<any> {
    try {
      const db = global.database;
      return await db.select(NAME_TABLE_DB.USER.NAME, [email], [NAME_TABLE_DB.USER.COLUMNS.EMAIL + "=?"]);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Salvando o usuario no Banco de dados
   * @param data dados do usuario
   */
  static async save(data: Register): Promise<any> {
    try {
      const db = global.database;
      const password = await Functions.encryptPassword(data.password);
      const user = {
        [NAME_TABLE_DB.USER.COLUMNS.NAME]: data.name,
        [NAME_TABLE_DB.USER.COLUMNS.EMAIL]: data.email,
        [NAME_TABLE_DB.USER.COLUMNS.DATE_REGISTRATION]: new Date(),
        [NAME_TABLE_DB.USER.COLUMNS.PASSWORD]: password
      };
      return await db.insert(NAME_TABLE_DB.USER.NAME, user);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Atualizando senha do usuario
   * @param password 
   * @param user 
   * @returns 
   */
  static async updatePassword(password: string, user: string): Promise<any> {
    try {
      const db = global.database;
      const passwordEncrypt = await Functions.encryptPassword(password);
      return await db.update(NAME_TABLE_DB.USER.NAME, { user_password: passwordEncrypt }, [NAME_TABLE_DB.USER.COLUMNS.ID + "="], [user]);
    } catch (error) {
      throw error;
    }
  }
}