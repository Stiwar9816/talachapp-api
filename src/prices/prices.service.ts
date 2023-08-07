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
// Entity/Input
import { CreatePriceInput, UpdatePriceInput } from './dto';
import { Price } from './entities/price.entity';
import { User } from 'src/users/entities/user.entity';
import { UserRoles } from 'src/auth/enums/user-role.enum';
import { CompaniesIdArgs } from 'src/orders/dto';
import { CompaniesService } from 'src/companies/companies.service';
// FileUpload
import { v4 as uuidv4 } from 'uuid';
import { s3Client } from './utils/s3Client';
import { FileUpload } from './interfaces/fileupload.interface';

@Injectable()
export class PricesService {
  private readonly logger = new Logger('PricesServices');

  constructor(
    @InjectRepository(Price)
    private readonly priceRepository: Repository<Price>,
    private readonly companiesService: CompaniesService,
  ) {}

  async create(
    createPriceInput: CreatePriceInput,
    user: User,
    company?: CompaniesIdArgs,
    file?: Promise<FileUpload>,
  ): Promise<Price> {
    const { idCompany } = company;
    const { name } = createPriceInput;
    try {
      const companies = await this.companiesService.findOne(idCompany);
      // Verificar si existe un precio con el mismo nombre pero no pertenece a la misma empresa
      const sameNameDifferentCompany = await this.priceRepository
        .createQueryBuilder('price')
        .where('price.name = :name', { name })
        .andWhere('price.company != :companyId', { companyId: companies.id })
        .getOne();

      // Verificar si existe un precio con el mismo nombre y la misma empresa
      const sameUserPrice = await this.priceRepository
        .createQueryBuilder('price')
        .where('price.name = :name', { name })
        .andWhere('price.company = :companyId', { companyId: companies.id })
        .getOne();

      if (sameUserPrice) {
        throw new Error(
          `${name} already exists for this ${companies.name_company}`,
        );
      }

      if (sameNameDifferentCompany) {
        // Agregar el nuevo precio si ya existe uno con el mismo nombre pero para otra empresa
        const newPrice = this.priceRepository.create({
          ...createPriceInput,
          image: '', // Save the filename to the 'image' property of the new price entity
          user,
          companies,
        });

        return this.priceRepository.save(newPrice);
      }

      const newPrice = this.priceRepository.create({
        ...createPriceInput,
        image: '', // Save the filename to the 'image' property of the new price entity
        user,
        companies,
      });

      if (file) {
        const { filename, createReadStream } = await file;
        const uuid = uuidv4();
        const nameImage = `${uuid}-${filename}`;
        newPrice.image = nameImage;

        const uploadParams = {
          Bucket: process.env.BUCKET_NAME,
          Key: nameImage,
          Body: createReadStream(),
        };

        try {
          await s3Client.upload(uploadParams).promise();
        } catch (error) {
          this.handleDBException(error);
        }
      }

      return await this.priceRepository.save(newPrice);
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findAll(): Promise<Price[]> {
    return await this.priceRepository.find();
  }

  async findAllByType(price: string, createBy: User): Promise<Price[]> {
    let query = this.priceRepository
      .createQueryBuilder('price')
      .leftJoinAndSelect('price.user', 'createBy');
    if (price === 'Producto' && createBy.roles[0] == UserRoles.Talachero) {
      query = query.where('price.type = :type AND price.createBy = :userId', {
        type: price,
        userId: createBy.id,
      });
    } else {
      query = query.where('price.type = :type', { type: price });
    }
    return query.getMany();
  }

  async findOne(id: string): Promise<Price> {
    try {
      return await this.priceRepository.findOneByOrFail({ id });
    } catch (error) {
      this.handleDBException({
        code: 'error-001',
        detail: `${id} not found`,
      });
    }
  }

  async findAllId(ids: string[]): Promise<Price[]> {
    return await this.priceRepository
      .createQueryBuilder('price')
      .where('price.id IN (:...ids)', { ids })
      .getMany();
  }

  async update(
    id: string,
    updatePriceInput: UpdatePriceInput,
    updateBy: User,
    file?: Promise<FileUpload>,
  ): Promise<Price> {
    const userId = await this.findOne(id);
    try {
      const price = await this.priceRepository.preload({
        id,
        ...updatePriceInput,
      });
      price.lastUpdateBy = updateBy;
      price.user = userId.user;

      if (file) {
        const { filename, createReadStream } = await file;
        const uuid = uuidv4();
        const nameImage = `${uuid}-${filename}`;
        price.image = nameImage;

        const uploadParams = {
          Bucket: process.env.BUCKET_NAME,
          Key: nameImage,
          Body: createReadStream(),
        };

        try {
          await s3Client.upload(uploadParams).promise();
        } catch (error) {
          this.handleDBException(error);
        }
      }

      return await this.priceRepository.save(price);
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async remove(id: string): Promise<Price> {
    const price = await this.findOne(id);
    return await this.priceRepository.remove(price);
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

  private handleDBNotFound(price: Price, id: string) {
    if (!price) throw new NotFoundException(`Price with id ${id} not found`);
  }
}
