import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
// TypeORM
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// Entity/Input
import { CreatePriceInput, UpdatePriceInput } from './dto';
import { Price } from './entities/price.entity';

@Injectable()
export class PricesService {

  private readonly logger = new Logger('PricesServices')

  constructor(
    @InjectRepository(Price)
    private readonly priceRepository: Repository<Price>
  ) { }

  async create(createPriceInput: CreatePriceInput): Promise<Price> {
    try {
      const newPrice = await this.priceRepository.create(createPriceInput)
      return await this.priceRepository.save(newPrice)
    } catch (error) {
      this.handleDBException(error)
    }
  }

  async findAll(): Promise<Price[]> {
    return await this.priceRepository.find()
  }

  async findOne(id: number): Promise<Price> {
    try {
      return await this.priceRepository.findOneByOrFail({ id })
    } catch (error) {
      this.handleDBException({
        code: 'error-001',
        detail: `${id} not found`
      })
    }
  }

  async update(id: number, updatePriceInput: UpdatePriceInput): Promise<Price> {
    const price = await this.findOne(id)
    this.handleDBNotFound(price, id)
    try {
      return await this.priceRepository.save(price)
    } catch (error) {
      this.handleDBException(error)
    }
  }

  async remove(id: number): Promise<Price> {
    const price = await this.findOne(id)
    return await this.priceRepository.remove(price)
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

  private handleDBNotFound(price: Price, id: number) {
    if (!price) throw new NotFoundException(`Price with id ${id} not found`)
  }
}
