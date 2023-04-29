import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
// TypeORM
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// Entity/Inputs
import { CreateCompanyInput, UpdateCompanyInput } from './dto';
import { Company } from './entities/company.entity';

@Injectable()
export class CompaniesService {

  private readonly logger = new Logger('CompaniesService')

  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>
  ) { }

  async create(createCompanyInput: CreateCompanyInput): Promise<Company> {
    try {
      const newCompany = await this.companyRepository.create(createCompanyInput)
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

  async update(id: number, updateCompanyInput: UpdateCompanyInput): Promise<Company> {
    const company = await this.findOne(id)
    this.handleDBNotFound(company, id)
    try {
      return await this.companyRepository.save(company)
    } catch (error) {
      this.handleDBException({
        code: 'error-001',
        detail: `${id} not found`
      })
    }
  }

  async remove(id: number): Promise<Company> {
    const company = await this.findOne(id)
    return await this.companyRepository.remove(company)
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
