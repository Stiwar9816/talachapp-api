import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Company } from 'src/companies/entities/company.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendUserConfirmation(user: User, plainPassword: string) {
    await this.mailerService.sendMail({
      to: user.email,
      subject: '¡Welcome to Talachapp! Here are your credentials',
      template: './confirmation',
      context: {
        name: user.fullName,
        password: plainPassword,
        email: user.email,
      },
    });
  }
  async sendUpdatePassword(user: User, plainPassword: string) {
    await this.mailerService.sendMail({
      to: user.email,
      subject: `Hi ${user.fullName}, Here are your credentials updated`,
      template: './confirmation',
      context: {
        name: user.fullName,
        password: plainPassword,
        email: user.email,
      },
    });
  }
  async sendResetPassword(user: User, plainPassword: string) {
    await this.mailerService.sendMail({
      to: user.email,
      subject: `Hi ${user.fullName}, Here is your new password`,
      template: './resetPassword',
      context: {
        name: user.fullName,
        password: plainPassword,
        email: user.email,
      },
    });
  }

  async sendNewCompany(company: Company) {
    await this.mailerService.sendMail({
      to: 'admin@talachapp.com',
      subject: 'New company registered',
      template: './newCompany',
      context: {
        person: company.user.fullName,
        name: company.name_company,
        email: company.user.email,
        phone: company.phone,
      },
    });
  }
}
