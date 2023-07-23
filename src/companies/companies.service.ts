import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
// TypeORM
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// Entity/Inputs
import { CreateCompanyInput, UpdateCompanyInput } from './dto';
import { Company } from './entities/company.entity';
import { User } from 'src/users/entities/user.entity';
import { MailService } from 'src/mail/mail.service';
@Injectable()
export class CompaniesService {
  private readonly logger = new Logger('CompaniesService');

  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    private readonly mailService: MailService,
  ) {}

  async create(
    createCompanyInput: CreateCompanyInput,
    createBy: User,
  ): Promise<Company> {
    try {
      const newCompany = this.companyRepository.create(createCompanyInput);
      newCompany.user = createBy;
      await this.mailService.sendNewCompany(newCompany);
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
      if( userId.roles[0]=== 'Talachero' || userId.roles[0]=== 'Centro Talachero'){
        query = query.where('companies.userId = :userId', {userId: userId.id})
      }
    return await query.getMany();
    } catch (error) {
      this.handleDBException({
        code: 'error-001',
        detail: `companies not found`,
      });
    }
    
  }

  async findOne(id: string): Promise<Company> {
    try {
      return await this.companyRepository.findOneByOrFail({ id });
    } catch (error) {
      this.handleDBException({
        code: 'error-001',
        detail: `${id} not found`,
      });
    }
  }

  async getWorkerCountByCompany(companyId: string): Promise<number> {
    try {
      const workerCount = await this.companyRepository
        .createQueryBuilder('company')
        .leftJoin('company.worker', 'worker')
        .where('company.id = :id', { id: companyId })
        .andWhere('worker.isActive = :isActive', { isActive: 'Activo' })
        .getCount();

      return workerCount;
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async update(
    id: string,
    updateCompanyInput: UpdateCompanyInput,
    updateBy: User,
  ): Promise<Company> {
    try {
      const company = await this.companyRepository.preload({
        id,
        ...updateCompanyInput,
      });
      company.lastUpdateBy = updateBy;
      return await this.companyRepository.save(company);
    } catch (error) {
      this.handleDBException({
        code: 'error-001',
        detail: `${id} not found`,
      });
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
      'Unexpected error, check server logs',
    );
  }

  private handleDBNotFound(company: Company, id: string) {
    if (!company)
      throw new NotFoundException(`Company with id ${id} not found`);
  }
}
