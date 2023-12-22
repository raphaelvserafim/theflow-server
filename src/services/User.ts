import { NAME_TABLE_DB } from "../constants";
import { Functions } from "../functions";
import { Register } from "../models/Auth";

export class User {

  static async byEmail(email: string): Promise<any> {
    try {
      const db = global.database;
      return await db.select(NAME_TABLE_DB.USER, [email], ["user_email = ?"]);
    } catch (error) {
      throw error;
    }
  }

  static async save(data: Register): Promise<any> {
    try {
      const db = global.database;
      const password = await Functions.encryptPassword(data.password);
      const user = {
        user_name: data.name,
        user_email: data.email,
        user_registration_date: new Date(),
        user_password: password
      };
      return await db.insert(NAME_TABLE_DB.USER, user);
    } catch (error) {
      throw error;
    }
  }
}