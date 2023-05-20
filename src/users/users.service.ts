import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException
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
import * as bcrypt from 'bcryptjs'
// Auth (Enum)
import { UserRoles } from 'src/auth/enums/user-role.enum';

@Injectable()
export class UsersService {

  private readonly logger = new Logger('UsersService')

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) { }

  async create(signupInput: SignupInput): Promise<User> {
    try {
      const newUser = await this.userRepository.create({
        ...signupInput,
        // Encrypt password
        password: bcrypt.hashSync(signupInput.password, 10)
      })

      return await this.userRepository.save(newUser)
    } catch (error) {
      this.handleDBException(error)
    }
  }

  async findAll(roles: UserRoles[]): Promise<User[]> {
    if (roles.length === 0) return await this.userRepository.find()
    // Find by role
    return this.userRepository.createQueryBuilder()
      .andWhere('ARRAY[roles] && ARRAY[:...roles]')
      .setParameter('roles', roles)
      .getMany()
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      return await this.userRepository.findOneByOrFail({ email })
    } catch (error) {
      this.handleDBException({
        code: 'error-001',
        detail: `${email} not found`
      })
    }
  }

  async findOneById(id: number): Promise<User> {
    try {
      return await this.userRepository.findOneByOrFail({ id })
    } catch (error) {
      this.handleDBException({
        code: 'error-001',
        detail: `${id} not found`
      })
    }
  }

  async update(id: number, updateUserInput: UpdateUserInput, updateBy: User): Promise<User> {
    try {
      const user = await this.userRepository.preload({ id, ...updateUserInput })
      user.lastUpdateBy = updateBy
      return await this.userRepository.save(user)
    } catch (error) {
      this.handleDBException(error)
    }
  }

  async block(id: number, user: User): Promise<User> {
    const userToBlock = await this.findOneById(id)
    userToBlock.isActive = 'Inactivo'
    userToBlock.lastUpdateBy = user
    return await this.userRepository.save(userToBlock)
  }

  // Manejo de excepciones
  private handleDBException(error: any): never {
    if (error.code === '23505')
      throw new BadRequestException(error.detail.replace('Key ', ''))

    if (error.code === 'error-001')
      throw new BadRequestException(error.detail.replace('Key ', ''))

    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error, check server logs')
  }

  private handleDBNotFound(user: User, email: string) {
    if (!user) throw new NotFoundException(`User with email ${email} not found`)
  }
}
