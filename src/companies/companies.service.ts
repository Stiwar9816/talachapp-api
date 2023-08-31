import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  forwardRef,
} from '@nestjs/common';
// TypeORM
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// Entity/Inputs
import { CreateCompanyInput, UpdateCompanyInput } from './dto';
import { Company } from './entities/company.entity';
import { User } from 'src/users/entities/user.entity';
import { MailService } from 'src/mail/mail.service';
import { UsersService } from 'src/users/users.service';
import { CompaniesIdArgs } from 'src/common';

@Injectable()
export class CompaniesService {
  private readonly logger = new Logger('CompaniesService');

  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
  ) {}

  async create(
    createCompanyInput: CreateCompanyInput,
    idTalachero: CompaniesIdArgs,
  ): Promise<Company> {
    const { idCompany } = idTalachero;
    try {
      const user = await this.usersService.findOneById(idCompany);
      const newCompany = this.companyRepository.create(createCompanyInput);
      newCompany.user = user;
      this.companyIsActive(newCompany);
      return await this.companyRepository.save(newCompany);
    } catch (error) {
      this.handleDBException(error);
    }
  }
  //Filter talacheros companies by id
  async findAll(userId: User): Promise<Company[]> {
    try {
      let query = this.companyRepository
        .createQueryBuilder('companies')
        .leftJoinAndSelect('companies.user', 'userId');
      if (
        userId.roles[0] === 'Talachero' ||
        userId.roles[0] === 'Centro Talachero'
      ) {
        query = query.where('companies.userId = :userId', {
          userId: userId.id,
        });
      }
      return await query.getMany();
    } catch (error) {
      this.handleDBException({
        code: 'error-001',
        detail: `Empresas no encontradas`,
      });
    }
  }

  async findOne(id: string): Promise<Company> {
    try {
      return await this.companyRepository.findOneByOrFail({ id });
    } catch (error) {
      this.handleDBException({
        code: 'error-001',
        detail: `${id} no encontrado`,
      });
    }
  }

  async getWorkerCountByCompany(companyId: string): Promise<number> {
    try {
      const workerCount = await this.companyRepository
        .createQueryBuilder('company')
        .leftJoin('company.userWorker', 'user')
        .where('company.id = :id', { id: companyId })
        .andWhere('user.isActive = :isActive', { isActive: 'Activo' })
        .select('COUNT(DISTINCT user.id)', 'conteo')
        .getRawOne();

      return workerCount.conteo;
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async update(
    id: string,
    updateCompanyInput: UpdateCompanyInput,
    updateBy: User,
    idTalachero?: CompaniesIdArgs,
  ): Promise<Company> {
    const { idCompany } = idTalachero;
    try {
      const company = await this.companyRepository.preload({
        id,
        ...updateCompanyInput,
      });

      if (idCompany) {
        const userFind = await this.usersService.findOneById(idCompany);
        company.user = userFind;
      }
      company.lastUpdateBy = updateBy;
      this.companyIsActive(company);
      return await this.companyRepository.save(company);
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async block(id: string, user: User): Promise<Company> {
    const companyToBlock = await this.findOne(id);
    companyToBlock.isActive = 'Inactivo';
    companyToBlock.lastUpdateBy = user;
    return await this.companyRepository.save(companyToBlock);
  }

  // Manejo de excepciones
  private handleDBException(error: any): never {
    if (error.code === '23505')
      throw new BadRequestException(error.detail.replace('Key ', ''));

    if (error.code === 'error-001')
      throw new BadRequestException(error.detail.replace('Key ', ''));

    this.logger.error(error);
    throw new InternalServerErrorException(
      'Error inesperado, verifique los registros del servidor',
    );
  }

  private companyIsActive(entity: Company) {
    const pattern = /^(\d+\.\d+,-\d+\.\d+,){2,}\d+\.\d+,-\d+\.\d+$/;
    pattern.test(entity.geofence.toString()) || entity.user === undefined
      ? (entity.isActive = 'Activo')
      : (entity.isActive = 'Inactivo');
  }
}
