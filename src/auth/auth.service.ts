// Nest Common
import { BadRequestException, Inject, Injectable, UnauthorizedException, forwardRef } from '@nestjs/common';
// Nest Jwt
import { JwtService } from '@nestjs/jwt';
// Crypto
import * as bcrypt from 'bcryptjs'
// Services
import { UsersService } from 'src/users/users.service';
// Types
import { AuthResponde } from './types/auth-response.type';
// Entity/Dto's
import { User } from 'src/users/entities/user.entity';
import { SignupInput, SigninInput } from './dto';
// MailService
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {

    constructor(
        private readonly jwtService: JwtService,
        private readonly mailService: MailService,
        @Inject(forwardRef(() => UsersService))
        private readonly usersService: UsersService
    ) { }

    getjwtToken(id: number) {
        return this.jwtService.sign({ id })
    }

    async signup(signupInput: SignupInput): Promise<AuthResponde> {
        const user = await this.usersService.create(signupInput)
        // Guarda una copia sin encriptar de la contraseña
        const plainPassword = signupInput.password;
        // Envía la contraseña sin encriptar por correo electrónico
        await this.mailService.sendUserConfirmation(user, plainPassword);
        const token = this.getjwtToken(user.id)
        return { token, user }
    }

    async signin(signinInput: SigninInput): Promise<AuthResponde> {
        const { email, password } = signinInput
        const user = await this.usersService.findOneByEmail(email)
        // Compare password
        if (!bcrypt.compareSync(password, user.password)) {
            throw new BadRequestException('Email or password do not match')
        }
        const token = this.getjwtToken(user.id)
        return { token, user }
    }

    async validateUser(id: number): Promise<User> {
        const user = await this.usersService.findOneById(id)
        if (!user.isActive)
            throw new UnauthorizedException(`User is inactive, talk with an admin`)
        delete user.password
        return user
    }

    revalidateToken(user: User): AuthResponde {
        const token = this.getjwtToken(user.id)
        return { token, user }
    }
}
