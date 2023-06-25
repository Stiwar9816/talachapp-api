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
// Dto's/Inputs
import { CreateOrderInput, UpdateOrderInput } from './dto';
// Entity
import { Order } from './entities/order.entity';
import { User } from 'src/users/entities/user.entity';
import { Price } from 'src/prices/entities/price.entity';
// Service
import { PricesService } from 'src/prices/prices.service';
import { CompaniesService } from 'src/companies/companies.service';
// Args
import { PriceIdsArgs } from './dto/args/priceIds.args';
import { CompaniesIdArgs } from './dto/args/companies.args';
// Conekta / Axios
import * as Conekta from 'conekta';
import axios from 'axios';
import { transactionPayment } from './utils/transactionPayment';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger('OrdersServices');

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly pricesService: PricesService,
    private readonly companiesService: CompaniesService
  ) {
    Conekta.api_key = process.env.PRIVARTE_KEY
    Conekta.apiVersion = '2.1.0'
  }

  async create(
    createOrderInput: CreateOrderInput,
    user: User,
    priceIds: PriceIdsArgs,
    companyId: CompaniesIdArgs
  ): Promise<Order> {
    let { status, total } = createOrderInput;
    const { ids } = priceIds;
    const { idCompany } = companyId
    try {
      const prices = await this.pricesService.findAllId(ids);
      const priceCount = ids.reduce((count, id) => {
        count[id] = (count[id] || 0) + 1; // Increment counter for current ID
        return count;
      }, {});

      // Subtract quantities from prices
      for (const price of prices) {
        const count = priceCount[price.id] || 0;
        price.stock -= count;
        this.handleNotQuantity(price)
        await this.pricesService.update(price.id, price, user); // Update the price in the database
      }

      // Transaction Payment
      let subTotal = 0; // variable initialization
      for (const price of prices) {
        const count = priceCount[price.id] || 0;
        subTotal += price.price * count;  // Sum of product values
      }
      const vTotal = transactionPayment(subTotal);

      const companies = await this.companiesService.findOne(idCompany);

      const newOrder = this.orderRepository.create({
        status,
        total: vTotal,
        prices,
        user,
        companies,
      });

      // List of products for create order
      const lineItems = prices.map((price) => {
        return {
          name: price.name,
          unit_price: +price.price,
          quantity: priceCount[price.id], // Quantity desired for each product
        };
      });

      //Create expiresAt 24hr 
      const now = new Date();
      const expiresAt = Math.round((now.getTime() + 24 * 60 * 60 * 1000) / 1000);

      const paymentLink = await Conekta.Checkout.create({
        name: 'Link de pago',
        allowed_payment_methods: ['card'],
        type: 'PaymentLink',
        order_template: {
          currency: 'MXN',
          customer_info: {
            name: user.fullName,
            email: user.email,
            phone: user.phone,
          },
          corporate: true,
          line_items: lineItems,
        },
        expires_at: expiresAt,
        needs_shipping_contact: false,
        recurrent: false
      });
      await this.sendPaymentEmail(user.email, paymentLink._json.id);
      return await this.orderRepository.save(newOrder);
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async sendPaymentEmail(email: string, id: string) {
    const headers = {
      accept: 'application/vnd.conekta-v2.1.0+json',
      'Accept-Language': 'es',
      'content-type': 'application/json',
      authorization: `Bearer ${process.env.PRIVARTE_KEY}`,
    };
    const url = `https://api.conekta.io/checkouts/${id}/email`;
    const data = { email };
    try {
      return await axios.post(url, data, { headers });
    } catch (error) {
      this.handleDBException({
        code: 'ERR_BAD_REQUEST',
        detail: `Error al enviar el correo electrónico:' ${error}`,
      });
    }
  }

  async getOrders() {
    const headers = {
      accept: 'application/vnd.conekta-v2.1.0+json',
      authorization: `Bearer ${process.env.PRIVARTE_KEY}`,
    };
    const url = 'https://api.conekta.io/orders';
    try {
      const res = await axios.get(url, { headers })
      return res.data.data
    } catch (error) {
      this.handleDBException({
        code: 'ERR_BAD_REQUEST',
        detail: `Error al obtener la información:' ${error}`,
      });
    }
  }

  async findAll(): Promise<Order[]> {
    await this.getOrders()
    return await this.orderRepository.find();
  }

  async findOne(id: number): Promise<Order> {
    try {
      return await this.orderRepository.findOneByOrFail({ id });
    } catch (error) {
      this.handleDBException({
        code: 'error-001',
        detail: `${id} not found`,
      });
    }
  }

  async update(
    id: number,
    updateOrderInput: UpdateOrderInput,
    updateBy: User,
  ): Promise<Order> {
    try {
      const order = await this.orderRepository.preload({
        id,
        ...updateOrderInput,
      });
      order.lastUpdateBy = updateBy;
      return await this.orderRepository.save(order);
    } catch (error) {
      this.handleDBException({
        code: 'error-001',
        detail: `${id} not found`,
      });
    }
  }

  async remove(id: number): Promise<Order> {
    const order = await this.findOne(id);
    return await this.orderRepository.remove(order);
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

  private handleDBNotFound(order: Order, id: number) {
    if (!order) throw new NotFoundException(`Order with id ${id} not found`);
  }

  private handleNotQuantity(price: Price) {
    if (price.stock < 0)
      throw new NotFoundException('Not enough quantity for your order');
  }
}
