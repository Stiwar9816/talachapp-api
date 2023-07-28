import {
  BadRequestException,
  HttpException,
  HttpStatus,
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
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { createWriteStream } from 'fs';
import { join } from 'path';
import { query } from 'express';
import { async } from 'rxjs';
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
      // Verificar si existe un precio con el mismo nombre y el mismo usuario
      const sameUserPrice = await this.priceRepository
        .createQueryBuilder('price')
        .where('price.name = :name', { name })
        .andWhere('price.createBy = :userId', { userId: user.id })
        .getOne();

      if (sameUserPrice) {
        throw new Error(`${name} already exists`);
      }

      const companies = await this.companiesService.findOne(idCompany);

      let newPrice = this.priceRepository.create({
        ...createPriceInput,
        image: '', // Save the filename to the 'image' property of the new price entity
        user,
        companies,
      });

      if (file) {
        const { filename, createReadStream } = await file;
        newPrice.image = filename;

        // Guardar la imagen en el servidor
        createReadStream()
          .pipe(
            createWriteStream(join(process.cwd(), `./uploads/${filename}`)),
          )
          .on('error', () => {
            throw new Error('Could not save image');
          });
      }

      return await this.priceRepository.save(newPrice);
    } catch (error) {
      // Handle the error properly
      throw new HttpException(
        error.message || 'Could not create price',
        HttpStatus.BAD_REQUEST,
      );
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
  ): Promise<Price> {
    const userId = await this.findOne(id);
    try {
      const price = await this.priceRepository.preload({
        id,
        ...updatePriceInput,
      });
      price.lastUpdateBy = updateBy;
      price.user = userId.user;
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
