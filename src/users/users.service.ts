import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
// Dto's
import { UpdateUserInput } from './dto';
// TypeORM
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
// Entity/Input
import { User } from './entities/user.entity';
import { SignupInput } from '../auth/dto/inputs/signup.input';
// Bcrypt
import * as bcrypt from 'bcryptjs';
// Auth (Enum)
import { UserRoles } from 'src/auth/enums/user-role.enum';
// Email
import { MailService } from 'src/mail/mail.service';
import { randomPassword } from 'src/auth/utils/randomPassword';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { CompaniesService } from 'src/companies/companies.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger('UsersService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailService: MailService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => CompaniesService))
    private readonly companiesService: CompaniesService,
  ) {}

  async create(signupInput: SignupInput): Promise<User> {
    try {
      if (signupInput.roles[0] == 'Trabajador') {
        signupInput.isActive = 'Inactivo'; // Set to inactive for worker role
      }
      const newUser = this.userRepository.create({
        ...signupInput,
        // Encrypt password
        password: bcrypt.hashSync(signupInput.password, 10),
      });
      return await this.userRepository.save(newUser);
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findAll(roles: UserRoles[]): Promise<User[]> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    if (roles.length > 0) {
      queryBuilder.andWhere('ARRAY[:...roles] && user.roles', { roles });
    }

    const users = await queryBuilder
      .leftJoinAndSelect('user.companies', 'companies')
      .getMany();

    return users;
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      return await this.userRepository.findOneByOrFail({ email });
    } catch (error) {
      this.handleDBException({
        code: 'error-001',
        detail: `${email} not found`,
      });
    }
  }

  async findOneById(id: string): Promise<User> {
    try {
      return await this.userRepository.findOneByOrFail({ id });
    } catch (error) {
      this.handleDBException({
        code: 'error-001',
        detail: `${id} not found`,
      });
    }
  }

  async update(
    id: string,
    updateUserInput: UpdateUserInput,
    updateBy: User,
  ): Promise<User> {
    try {
      const user = await this.userRepository.preload({
        id,
        ...updateUserInput,
      });
      if (updateUserInput.password) {
        // Guarda una copia sin encriptar de la contraseña
        const plainPassword = updateUserInput.password;
        // Envía la contraseña sin encriptar por correo electrónico
        await this.mailService.sendUpdatePassword(user, plainPassword);
        // Encrypt password
        user.password = bcrypt.hashSync(updateUserInput.password, 10);
      }
      user.lastUpdateBy = updateBy;
      return await this.userRepository.save(user);
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async block(id: string, user: User): Promise<User> {
    const userToBlock = await this.findOneById(id);
    userToBlock.isActive = 'Inactivo';
    userToBlock.lastUpdateBy = user;
    return await this.userRepository.save(userToBlock);
  }

  async resetPassword(email: string) {
    try {
      const userReset = await this.findOneByEmail(email);
      const newPassword = randomPassword();
      this.mailService.sendResetPassword(userReset, newPassword);
      userReset.password = bcrypt.hashSync(newPassword, 10);
      return await this.userRepository.save(userReset);
    } catch (error) {
      this.handleDBException({
        code: 'error-001',
        detail: `${email} not found`,
      });
    }
  }

  async resetPasswordAuth(password: string, user: User) {
    const token = await this.authService.getjwtToken(
      user.id,
      user.roles,
      user.fullName,
    );
    const decodedToken = this.jwtService.verify(token); // Decodifica el token
    const id = decodedToken.id; // Obtiene el ID del usuario del token decodificado
    try {
      const user = await this.findOneById(id);
      const newPassword = password;
      this.mailService.sendResetPassword(user, newPassword);
      user.password = bcrypt.hashSync(newPassword, 10);
      return await this.userRepository.save(user);
    } catch (error) {
      this.handleDBException({
        code: 'error-001',
        detail: `${user} not found`,
      });
    }
  }

  // Manejo de excepciones
  private handleDBException(error: any): never {
    if (error.code === '23505')
      throw new BadRequestException(error.detail.replace('Key ', ''));

    if (error.code === 'error-001')
      throw new BadRequestException(error.detail.replace('Key ', ''));

    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }

  private handleDBNotFound(user: User, email: string) {
    if (!user)
      throw new NotFoundException(`User with email ${email} not found`);
  }
}
