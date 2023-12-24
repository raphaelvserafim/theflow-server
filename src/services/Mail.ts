
import sgMail from '@sendgrid/mail';
import fs from 'fs';
import { getEnv } from '../config/env';

const { SYSTEM_NAME, TOKEN_SEND_GRID, EMAIL_NOTIFICATIONS } = getEnv();

sgMail.setApiKey(TOKEN_SEND_GRID);

export class Mail {


  /**
   * Enviando codigo para redefinir a senha
   * @param email email que vai ser para enviado
   * @param code codigo para redefinir a senha
   */
  static async sendCodeNewPassword(email: string, name: string, code: string): Promise<[sgMail.ClientResponse, {}]> {
    try {
      const htmlTemplate = fs.readFileSync('./html/resetPasswordTemplate.html', 'utf-8');
      const replacements = {
        '{{code}}': code,
        '{{name}}': name,
        '{{SYSTEM_NAME}}': SYSTEM_NAME,
      };
      const emailHtml = Object.entries(replacements).reduce((html: any, [placeholder, value]) => html?.replaceAll(placeholder, value), htmlTemplate);
      const data = {
        to: email,
        from: `${SYSTEM_NAME}<${EMAIL_NOTIFICATIONS}>`,
        subject: "Reset your password",
        html: emailHtml
      }
      return await sgMail.send(data);
    } catch (error) {
      throw error;
    }
  }


}