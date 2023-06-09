import { Column, CreateDateColumn, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
// GraphQL
import { ObjectType, Field, Int } from '@nestjs/graphql';
// Entity
import { Company } from 'src/companies/entities/company.entity';
import { Payment } from 'src/payments/entities/payment.entity';
import { User } from 'src/users/entities/user.entity';
import { Price } from 'src/prices/entities/price.entity';
@Entity({ name: 'orders' })
@ObjectType({
  description:
    `
  Scheme where all the information on customer orders is stored, 
  as well as the company that will provide the service, the products or services, 
  the method of payment and the user's data.
  `
})
export class Order {
  @PrimaryGeneratedColumn('increment')
  @Field(() => Int, {
    description: 'Id automatically generated in integer format eg: 1,2,3..'
  })
  id: number

  @Column('text', { default: ['espera'] })
  @Field(() => String, {
    description: 'order status [waiting or completed]'
  })
  status: string

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.orders, { nullable: false, lazy: true })
  @Index('userId-index')
  @Field(() => User, {
    description: 'Relationship with the many-to-one users table'
  })
  user: User

  @ManyToOne(() => User, (user) => user.lastUpdateBy, { nullable: true, lazy: true })
  @JoinColumn({ name: 'lastUpdateBy' })
  @Field(() => User, {
    nullable: true,
    description: 'Returns the information of the user who made the last update of the company data'
  })
  lastUpdateBy?: User

  @ManyToOne(() => Company, comapny => comapny.order)
  @Index('companyID-index')
  @Field(() => Company, {
    description: 'Relationship with the many-to-one companies table'
  })
  companies: Company

  @OneToOne(() => Payment)
  @Field(() => Payment, {
    description: 'Relationship with the many-to-one payments table'
  })
  payments: Payment

  @ManyToMany(() => Price)
  @JoinTable()
  prices: Price[];
}
