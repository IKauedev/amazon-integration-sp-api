import { Injectable } from "@nestjs/common";
import { MailerService } from '@nestjs-modules/mailer';


@Injectable()
export class MailerSendService {
    constructor(private readonly mailerService: MailerService) {}
  
    public sendEmail(toemail: string, subject: string, text: string): void {
        this.mailerService
          .sendMail({
            to: toemail,
            from: 'noreply@nestJSamazon.com',
            subject: subject,
            text: text,
            template: __dirname + '/relatory-product-amazon',
          })
          .then(() => {})
          .catch(() => {});
    }
}