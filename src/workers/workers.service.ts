import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateWorkerInput, UpdateWorkerInput } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Worker } from './entities/worker.entity';
import { CompaniesIdArgs } from 'src/orders/dto';
import { CompaniesService } from 'src/companies/companies.service';

@Injectable()
export class WorkersService {
  private readonly logger = new Logger('WorkersService');

  constructor(
    @InjectRepository(Worker)
    private readonly workerRepository: Repository<Worker>,
    private readonly companiesService: CompaniesService,
  ) {}

  // async create(
  //   createWorkerInput: CreateWorkerInput,
  //   createBy: User,
  //   company?: CompaniesIdArgs,
  // ): Promise<Worker> {
  //   const { idCompany } = company;
  //   try {
  //     const companies = await this.companiesService.findOne(idCompany);
  //     const newWorker = this.workerRepository.create({
  //       ...createWorkerInput,
  //       user: createBy,
  //       companies,
  //     });
  //     return await this.workerRepository.save(newWorker);
  //   } catch (error) {
  //     this.handleDBException({
  //       code: '23505',
  //       detail: `${createWorkerInput.fullName} already exists`,
  //     });
  //   }
  // }

  async findAll(user: User): Promise<Worker[]> {
    // Find All companies assing to a user
    const company = await this.companiesService.findAll(user);

    // Filtering of workers assigned to a company
    let query = this.workerRepository
      .createQueryBuilder('workers')
      .leftJoinAndSelect('workers.companies', 'company');
    if (user.roles[0] === 'Talachero' || user.roles[0] === 'Centro Talachero') {
      const companiesIds = company.map((company) => company.id);
      query = query.where('workers.companies IN (:...company)', {
        company: companiesIds,
      });
    }
    // Retur all workers
    return await query.getMany();
  }

  async findOne(id: string) {
    try {
      return await this.workerRepository.findOneByOrFail({ id });
    } catch (error) {
      this.handleDBException({
        code: 'error-001',
        detail: `${id} not found`,
      });
    }
  }

  async update(
    id: string,
    updateWorkerInput: UpdateWorkerInput,
    updateBy: User,
  ) {
    try {
      const worker = await this.workerRepository.preload({
        id,
        ...updateWorkerInput,
      });
      worker.lastUpdateBy = updateBy;
      return await this.workerRepository.save(worker);
    } catch (error) {
      this.handleDBException({
        code: 'error-001',
        detail: `${updateWorkerInput.fullName} not found`,
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
}
