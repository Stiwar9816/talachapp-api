import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
// GraphQL
import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
// Entity
import { Company } from 'src/companies/entities/company.entity';
import { Payment } from 'src/payments/entities/payment.entity';
import { Score } from 'src/scores/entities/score.entity';
import { Price } from 'src/prices/entities/price.entity';
import { Order } from 'src/orders/entities/order.entity';
@Entity({ name: 'users' })
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('increment')
  @Field(() => Int)
  id: number

  @Column('text')
  @Field(() => String)
  fullName: string

  @Column('float', { nullable: true })
  @Field(() => Float, { nullable: true })
  phone?: number

  @Column('text', { unique: true })
  @Field(() => String)
  email: string

  @Column('text', {
    array: true,
    default: ['usuario']
  })
  @Field(() => [String])
  roles: string[]

  @Column('text')
  @Field(() => String)
  password: string

  @Column('bool', {
    default: true
  })
  @Field(() => Boolean)
  isActive: boolean

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.lastUpdateBy, { nullable: true, lazy: true })
  @JoinColumn({ name: 'lastUpdateBy' })
  @Field(() => User, { nullable: true })
  lastUpdateBy?: User

  @OneToMany(() => Company, company => company.user)
  @Field(() => Company)
  companies: Company

  @OneToMany(() => Payment, payment => payment.user)
  @Field(() => Payment)
  payments: Payment

  @OneToMany(() => Price, price => price.user)
  @Field(() => Price)
  prices: Price

  @OneToMany(() => Score, score => score.user)
  @Field(() => Score)
  scores: Score

  @OneToMany(() => Order, order => order.user)
  @Field(() => Order)
  orders: Order

  // Convertimos los datos del email a minúsculas
  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim()
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkFieldsBeforeInsert()
  }
}
