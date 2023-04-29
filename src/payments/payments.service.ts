import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreatePaymentInput } from './dto/inputs/create-payment.input';
import { UpdatePaymentInput } from './dto/inputs/update-payment.input';
import { Price } from 'src/prices/entities/price.entity';
import { Payment } from './entities/payment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentsService {

  private readonly logger = new Logger('PaymentsServices')

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>
  ) { }

  async create(createPaymentInput: CreatePaymentInput): Promise<Payment> {
    try {
      const newPayment = await this.paymentRepository.create(createPaymentInput)
      return await this.paymentRepository.save(newPayment)
    } catch (error) {
      this.handleDBException(error)
    }
  }

  async findAll(): Promise<Payment[]> {
    return this.paymentRepository.find()
  }

  async findOne(id: number): Promise<Payment> {
    try {
      return await this.paymentRepository.findOneByOrFail({ id })
    } catch (error) {
      this.handleDBException({
        code: 'error-001',
        detail: `${id} not found`
      })
    }

  }

  async update(id: number, updatePaymentInput: UpdatePaymentInput): Promise<Payment> {
    const payment = await this.findOne(id)
    this.handleDBNotFound(payment, id)
    try {
      return await this.paymentRepository.save(payment)
    } catch (error) {
      this.handleDBException(error)
    }
  }

  async remove(id: number): Promise<Payment> {
    const payment = await this.findOne(id)
    return await this.paymentRepository.remove(payment)
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

  private handleDBNotFound(payment: Payment, id: number) {
    if (!payment) throw new NotFoundException(`Payment with id ${id} not found`)
  }
}
