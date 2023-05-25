import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { decrypt } from 'src/auth/utils/crypto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) { }

    async sendUserConfirmation(user: User) {
        await this.mailerService.sendMail({
            to: user.email,
            subject: '¡Welcome to Talachapp! Here are your credentials',
            template: './confirmation',
            context: {
                name: user.fullName,
                password: decrypt(user.password),
                email: user.email
            }
        })
    }
}
