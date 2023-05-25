import { CreateDateColumn, Entity, UpdateDateColumn, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
// GraphQL
import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
// Entity
import { User } from 'src/users/entities/user.entity';
import { Order } from 'src/orders/entities/order.entity';

@Entity({ name: 'payments' })
@ObjectType({
  description: 'Scheme where all the information about user payments will be displayed'
})
export class Payment {

  @PrimaryGeneratedColumn('increment')
  @Field(() => Int, {
    description: 'Id automatically generated in integer format eg: 1,2,3..'
  })
  id: number

  @Column('text')
  @Field(() => String, {
    description: 'Value of the payment of the service provided'
  })
  toll: string

  @Column('text')
  @Field(() => String, {
    description: ''
  })
  transfer: string

  @Column('text')
  @Field(() => String, {
    description: ''
  })
  banner: string

  @Column('text')
  @Field(() => String, {
    description: 'User card type'
  })
  card_type: string

  @Column('text')
  @Field(() => String, {
    description: 'Name of the bank that the user uses'
  })
  bank_name: string

  @Column('float')
  @Field(() => Float, {
    description: 'Total bill of requested services'
  })
  total: number

  @Column('text', {
    default: 'Espera'
  })
  @Field(() => String, {
    description: 'payment status [waiting, processing or completed]'
  })
  state: string

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.payments)
  @JoinColumn({ name: 'userId' })
  user: User

  @OneToOne(() => Order)
  @Field(() => Order, {
    description: 'Relationship with the many-to-one orders table'
  })
  order: Order
}
