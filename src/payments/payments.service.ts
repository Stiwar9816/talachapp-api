import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreatePaymentInput } from './dto';
import { Payment } from './entities/payment.entity';
// import { conekta } from '../config/conekta.config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as Conekta from 'conekta';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger('PaymentsServices');

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {
    Conekta.api_key = process.env.PRIVARTE_KEY
    Conekta.apiVersion =  '2.1.0'
  }

  async create(createPaymentInput: CreatePaymentInput, user: User): Promise<Payment> {
    try {
      const newPayment = this.paymentRepository.create(createPaymentInput);
       const charge = await Conekta.Charge.create({
        customer_info: {
          name: user.fullName,
          email: user.email,
          phone: user.phone
        },
        currency: 'MXN',
        line_items: [
          {
            name: 'Producto 3',
            unit_price: +newPayment.total,
            quantity: 3,
          },
          {
            name: 'Aloe vera',
            unit_price: 500.00,
            quantity: 3,
          },
        ],
        charges: [
          {
            payment_method: {
              type: 'card',
              token_id: newPayment.card_type,
              amount:+newPayment.total
            },
          },
        ],
      });
      
      console.log(charge)

      return await this.paymentRepository.save(newPayment);
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findAll(): Promise<Payment[]> {
    return this.paymentRepository.find();
  }

  async findOne(id: number): Promise<Payment> {
    try {
      return await this.paymentRepository.findOneByOrFail({ id });
    } catch (error) {
      this.handleDBException({
        code: 'error-001',
        detail: `${id} not found`,
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

  private handleDBNotFound(payment: Payment, id: number) {
    if (!payment)
      throw new NotFoundException(`Payment with id ${id} not found`);
  }
}
