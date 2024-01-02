import { Injectable, Logger } from "@nestjs/common";
import { InjectMailer, Mailer } from "nestjs-mailer";
import { Auth } from "@api/entities";
import { SendEmailActiveDTO, SendEmailPasswordResetDTO } from "@api/dtos";

@Injectable()
export class EmailService {
  constructor(
    @InjectMailer()
    public mailer: Mailer,
  ) { }
  
  /**
   * Send email from default sender
   * data: { from, to, cc, subject, text, html }
   * @param {any} data
   */
  async sendFromAdmin(data: any) {
    Logger.debug('start', 'sendFromAdmin');
    const {
      from = `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
      to = '',
      cc = [],
      subject = '',
      text = '',
      html = '',
    } = data;
    Logger.debug(JSON.stringify(data), 'sendFromAdmin');
    try {
      return this.mailer.sendMail({ from, to, subject, text, html, cc});
    } catch(error) {
      Logger.error(JSON.stringify(error), 'sendFromAdmin');
    }
  }

  /**
   * Send email active to user
   * @param {Auth} auth
   */
  async sendEmailActive(data: SendEmailActiveDTO) {
    Logger.debug('start', 'sendEmailActive');
    let activeLink = process.env.API_URL + `/auth/active/?id=[id]&token=[token]`;
    activeLink = activeLink.replace('[id]', data.id).replace('[token]', data.token);
    const content = 'Please click on the link below to active your account.<br/>' + activeLink;
    return this.sendFromAdmin({
      to: data.email,
      subject: 'Active your email ?',
      text: content,
      html: content,
    });
  }

  /**
   * Send email reset password to user
   * @param {sendEmailPasswordResetDTO} data
   */
  async sendEmailPasswordReset(data: SendEmailPasswordResetDTO) {
    Logger.debug('start', 'sendEmailPasswordReset');
    let resetLink = process.env.API_URL + `/auth/password/reset/?id=[id]&token=[token]`;
    resetLink = resetLink.replace('[id]', data.id).replace('[token]', data.token);
    const content = 'Please click on the link below to reset your password.<br/>' + resetLink;
    return this.sendFromAdmin({
      to: data.email,
      subject: 'Reset your password ?',
      text: content,
      html: content,
    });
  }
}
