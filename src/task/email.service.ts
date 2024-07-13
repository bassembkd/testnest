import { Injectable } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class EmailService {
  constructor() {
    sgMail.setApiKey('yourSendGridApiKey');
  }

  async sendEmail(to: string, subject: string, text: string) {
    const msg = {
      to,
      from: 'your-email@example.com',
      subject,
      text,
    };
    await sgMail.send(msg);
  }
}
