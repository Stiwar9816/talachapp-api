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
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { CompaniesService } from 'src/companies/companies.service';
// Common / Args / Utils
import { CompaniesIdArgs, randomPassword } from 'src/common';

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

  async create(
    signupInput: SignupInput,
    company?: CompaniesIdArgs,
  ): Promise<User> {
    const { idCompany } = company;
    try {
      const newUser = this.userRepository.create({
        ...signupInput,
        password: bcrypt.hashSync(signupInput.password, 10),
      });

      this.validRoleTrabajador(newUser, 'Trabajador', idCompany);

      if (idCompany) {
        const companiesWorker = await this.companiesService.findOne(idCompany);
        newUser.companiesWorker = companiesWorker;
      }

      this.userIsActive('Trabajador', newUser);
      this.userIsActive('Talachero', newUser);

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
      .leftJoinAndSelect('user.companiesWorker', 'companiesWorker')
      .getMany();

    return users;
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      return await this.userRepository.findOneByOrFail({ email });
    } catch (error) {
      this.handleDBException({
        code: 'error-001',
        detail: `${email} no encontrado`,
      });
    }
  }

  async findOneById(id: string): Promise<User> {
    try {
      return await this.userRepository.findOneByOrFail({ id });
    } catch (error) {
      this.handleDBException({
        code: 'error-001',
        detail: `${id} no encontrado`,
      });
    }
  }

  async update(
    id: string,
    updateUserInput: UpdateUserInput,
    updateBy: User,
    company?: CompaniesIdArgs,
  ): Promise<User> {
    const { idCompany } = company;
    try {
      const companiesWorker = await this.companiesService.findOne(idCompany);
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
      user.companiesWorker = companiesWorker;

      this.userIsActive('Trabajador', user);

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
        detail: `${email} no encontrado`,
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
        detail: `${user} no encontrado`,
      });
    }
  }

  async updateToken(email: string, token: string): Promise<User> {
    try {
      const userFind = await this.findOneByEmail(email);

      if (!userFind)
        this.handleDBException({
          code: 'error-001',
          detail: `${email} no encontrado`,
        });
      const user = await this.userRepository.preload({
        ...userFind,
        token: token,
      });
      return await this.userRepository.save(user);
    } catch (error) {
      this.handleDBException(error);
    }
  }

  // Manejo de excepciones
  private handleDBException(error: any): never {
    if (error.code === '23505')
      throw new BadRequestException(error.detail.replace('Key ', ''));

    if (error.code === 'error-001')
      throw new BadRequestException(error.detail.replace('Key ', ''));

    if (error.code === 'error-002')
      throw new BadRequestException(error.detail.replace('Key ', ''));

    this.logger.error(error);
    throw new InternalServerErrorException(
      'Error inesperado, verifique los registros del servidor',
    );
  }

  private userIsActive(field: string, entity: User) {
    if (entity.roles.includes(field)) {
      entity.geofence.length === 0
        ? (entity.isActive = 'Inactivo')
        : (entity.isActive = 'Activo');
    }
  }

  private validRoleTrabajador(field: User, role: string, company: string) {
    if (field.roles.includes(role)) {
      if (!company)
        this.handleDBException({
          code: 'error-002',
          detail:
            'Error: Un usuario con el rol "Trabajador" debe estar asignado a una empresa.',
        });
    } else {
      if (company)
        this.handleDBException({
          code: 'error-003',
          detail:
            'Error: Sólo los usuarios con rol "Trabajador" pueden ser asignados a una empresa.',
        });
    }
  }
}
