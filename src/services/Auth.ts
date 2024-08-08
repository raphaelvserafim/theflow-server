import * as EmailValidator from 'email-validator';
import jwt from 'jsonwebtoken';
import { Login, Register, UpdatedPassword } from "@app/models/Auth";
import { Functions } from "@app/utils";
import { getEnv } from '@app/config/env';
import { NewPasswords } from '@app/database/NewPasswords';
import { User, Mail } from '@app/services';

const { JWT_KEY } = getEnv();

export class ServiceAuth {

  static generateSession(payload: {}) {
    try {
      return jwt.sign(payload, JWT_KEY, { expiresIn: '7d' });
    } catch (error) {
      throw error;
    }
  }

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
      const user = await User.byEmail(data.email);
      if (!user) {
        throw new Error("email not found");
      }

      const validPassword = await Functions.comparePasswords(data.password, user.password);
      if (!validPassword) {
        throw new Error("invalid password");
      }
      const session = this.generateSession({ user: user.id });
      return { status: 200, session };
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

      if (response) {
        throw new Error("an account already uses this email");
      }
      const user = await User.save(data);
      if (user.id) {
        const session = this.generateSession({ user: user.id });
        return { status: 200, session };
      } else {
        throw new Error("Error saving to DB");
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

      const user = await User.byEmail(email);

      if (!user) {
        throw new Error("Email not found");
      }

      const { id } = user.dataValues;

      const response = await NewPasswords.findOne({ where: { userId: id } });

      if (response) {
        const { expire, status } = response.dataValues;
        if (status) {
          throw new Error("A code has already been sent to your email.");
        }
      }

      const code = Functions.generateRandomNumbers(5);

      let expire = new Date();

      expire.setHours(expire.getHours() + 2);

      await NewPasswords.create({ userId: user.id, token: code, status: true, expire });

      await Mail.sendCodeNewPassword(email, user.name, String(code));
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
      const response = await NewPasswords.findOne({ where: { token: code } });

      if (!response) {
        throw new Error("code not found");
      }
      const { userId, status } = response.dataValues;

      if (!status) {
        throw new Error("code expired");
      }

      await User.updatePassword(password, userId);
      await NewPasswords.update({ status: false }, { where: { token: code } });
      return { status: 200, message: "Updated successfully" };
    } catch (error) {
      return { status: 500, message: error.message };
    }
  }


}