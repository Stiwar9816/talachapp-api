import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) { }

    async sendUserConfirmation(user: User, plainPassword: string) {
        await this.mailerService.sendMail({
            to: user.email,
            subject: '¡Welcome to Talachapp! Here are your credentials',
            template: './confirmation',
            context: {
                name: user.fullName,
                password: plainPassword,
                email: user.email
            }
        })
    }
    async sendUpdatePassword(user: User, plainPassword: string) {
        await this.mailerService.sendMail({
            to: user.email,
            subject: `Hi ${user.fullName}, Here are your credentials updated`,
            template: './confirmation',
            context: {
                name: user.fullName,
                password: plainPassword,
                email: user.email
            }
        })
    }
    async sendResetPassword(user: User, plainPassword: string) {
        await this.mailerService.sendMail({
            to: user.email,
            subject: `Hi ${user.fullName}, Here is your new password`,
            template: './resetPassword',
            context: {
                name: user.fullName,
                password: plainPassword,
                email: user.email
            }
        })
    }
}
