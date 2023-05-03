import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
// GraphQL
import { ObjectType, Field, Int } from '@nestjs/graphql';
// Entity
import { Company } from 'src/companies/entities/company.entity';
import { Payment } from 'src/payments/entities/payment.entity';
import { User } from 'src/users/entities/user.entity';
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
  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'user' })
  user: User

  @ManyToOne(() => User, (user) => user.lastUpdateBy, { nullable: true, lazy: true })
  @JoinColumn({ name: 'lastUpdateBy' })
  @Field(() => User, { nullable: true })
  lastUpdateBy?: User

  @ManyToOne(() => Company, comapny => comapny.order)
  @JoinColumn({ name: 'companiesID' })
  companies: Company

  @OneToOne(() => Payment)
  @JoinColumn({ name: 'paymentsID' })
  payments: Payment
}
