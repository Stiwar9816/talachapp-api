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
      subject: '¡Bienvenido a Talachapp! Aquí están tus credenciales!',
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
      subject: `Hola ${user.fullName}, Aquí están tus credenciales actualizadas.`,
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
      subject: `Hola ${user.fullName}, Aquí está tu nueva contraseña`,
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
      subject: 'Solicitud para crear empresa',
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
