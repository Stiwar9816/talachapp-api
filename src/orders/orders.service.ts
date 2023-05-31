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
import { PricesService } from 'src/prices/prices.service';
import { PriceIdsArgs } from './dto/args/priceIds.args';
import { Price } from 'src/prices/entities/price.entity';
import * as Conekta from 'conekta';
import axios from 'axios';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger('OrdersServices');

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly pricesService: PricesService,
  ) {
    Conekta.api_key = process.env.PRIVARTE_KEY;
    Conekta.apiVersion = '2.1.0';
  }

  async create(
    createOrderInput: CreateOrderInput,
    user: User,
    priceIds: PriceIdsArgs,
  ): Promise<Order> {
    const { ...createOrder } = createOrderInput;
    const { ids } = priceIds;
    try {
      const prices = await this.pricesService.findAllId(ids);
      const priceCount = {}; // Initialize an object to count occurrences of each price ID
      ids.forEach((id) => {
        priceCount[id] = (priceCount[id] || 0) + 1; // Increment counter for current ID
      });
      // Subtract quantities from prices
      for (const price of prices) {
        const id = price.id;
        const count = priceCount[id] || 0;
        price.stock -= count;
        await this.pricesService.update(price.id, price, user); // Update the price in the database
      }
      const newOrder = this.orderRepository.create({
        ...createOrder,
        prices,
        user,
      });

      // List of products for create order
      const lineItems = prices.map((price) => {
        const id = price.id;
        const quantity = priceCount[id];
        return {
          name: price.name,
          unit_price: +price.price,
          quantity: quantity, // Cantidad deseada para cada producto
        };
      });

      //Create expiresAt 24hr 
      const now = new Date();
      const expiresAt = Math.round(new Date(now.getTime() + 24 * 60 * 60 * 1000).getTime() / 1000);


      const paymentLink = await Conekta.Checkout.create({
        name: 'Link de pago 1594138857',
        allowed_payment_methods: ['card', 'bank_transfer'],
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
        recurrent: false,
      });

      await this.sendPaymentEmail(user.email, paymentLink._json.id);

      return await this.orderRepository.save(newOrder);
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async sendPaymentEmail(email: string, id: string) {
    const options = {
      method: 'POST',
      url: `https://api.conekta.io/checkouts/${id}/email`,
      headers: {
        accept: 'application/vnd.conekta-v2.1.0+json',
        'Accept-Language': 'es',
        'content-type': 'application/json',
        authorization: `Bearer ${process.env.PRIVARTE_KEY}`,
      },
      data: { email },
    };

    try {
      await axios.request(options);
    } catch (error) {
      console.error('Error al enviar el correo electrónico:', error);
    }
  }

  async findAll(): Promise<Order[]> {
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
