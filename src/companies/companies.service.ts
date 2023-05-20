import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
// TypeORM
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// Entity/Inputs
import { CreateCompanyInput, UpdateCompanyInput } from './dto';
import { Company } from './entities/company.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class CompaniesService {

  private readonly logger = new Logger('CompaniesService')

  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>
  ) { }

  async create(createCompanyInput: CreateCompanyInput, createBy: User): Promise<Company> {
    try {
      const newCompany = await this.companyRepository.create(createCompanyInput)
      newCompany.user = createBy
      return await this.companyRepository.save(newCompany)
    } catch (error) {
      this.handleDBException(error)
    }
  }

  async findAll(): Promise<Company[]> {
    return this.companyRepository.find()
  }

  async findOne(id: number): Promise<Company> {
    try {
      return await this.companyRepository.findOneByOrFail({ id })
    } catch (error) {
      this.handleDBException({
        code: 'error-001',
        detail: `${id} not found`
      })
    }
  }

  async update(id: number, updateCompanyInput: UpdateCompanyInput, updateBy: User): Promise<Company> {
    try {
      const company = await this.companyRepository.preload({ id, ...updateCompanyInput })
      company.lastUpdateBy = updateBy
      return await this.companyRepository.save(company)
    } catch (error) {
      this.handleDBException({
        code: 'error-001',
        detail: `${id} not found`
      })
    }
  }

  async block(id: number, user: User): Promise<Company> {
    const companyToBlock = await this.findOne(id)
    companyToBlock.isActive = 'Inactivo'
    companyToBlock.lastUpdateBy = user
    return await this.companyRepository.save(companyToBlock)
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

  private handleDBNotFound(company: Company, id: number) {
    if (!company) throw new NotFoundException(`Company with id ${id} not found`)
  }
}
