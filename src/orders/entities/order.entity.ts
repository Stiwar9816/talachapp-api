import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
// GraphQL
import { ObjectType, Field, Int } from '@nestjs/graphql';
// Entity
import { Company } from 'src/companies/entities/company.entity';
import { Payment } from 'src/payments/entities/payment.entity';
import { User } from 'src/users/entities/user.entity';
import { Price } from 'src/prices/entities/price.entity';
@Entity({ name: 'orders' })
@ObjectType()
export class Order {
  @PrimaryGeneratedColumn('increment')
  @Field(() => Int)
  id: number

  @Column('text', { default: ['espera'] })
  @Field(() => String)
  status: string

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.orders, { nullable: false, lazy: true })
  @Index('userId-index')
  @Field(() => User)
  user: User

  @ManyToOne(() => User, (user) => user.lastUpdateBy, { nullable: true, lazy: true })
  @JoinColumn({ name: 'lastUpdateBy' })
  @Field(() => User, { nullable: true })
  lastUpdateBy?: User

  @ManyToOne(() => Company, comapny => comapny.order)
  @Index('companyID-index')
  @Field(() => Company)
  companies: Company

  @OneToOne(() => Payment)
  @Field(() => Payment)
  payments: Payment

  @OneToMany(() => Price, price => price.order, { nullable: true, lazy: true })
  @Field(() => [Price], { nullable: true })
  prices: Price[]
}
