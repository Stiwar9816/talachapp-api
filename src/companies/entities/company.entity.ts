import { CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, Column, Entity, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
// GraphQL
import { ObjectType, Field, Int } from '@nestjs/graphql';
// Entity
import { Order } from 'src/orders/entities/order.entity';
import { User } from 'src/users/entities/user.entity';

@Entity({ name: 'companies' })
@ObjectType()
export class Company {

  @PrimaryGeneratedColumn('increment')
  @Field(() => Int)
  id: number

  @Column('text', { unique: true })
  @Field(() => String)
  name_company: string

  @Column('int')
  @Field(() => Int)
  phone: number

  @Column('text', { nullable: true })
  @Field(() => String, { nullable: true })
  rfc?: string

  @Column('text', { nullable: true })
  @Field(() => String, { nullable: true })
  cfdi?: string

  @Column('text')
  @Field(() => String)
  bussiness_name: string

  @Column('text', { nullable: true })
  @Field(() => String, { nullable: true })
  address?: string

  @Column('text')
  @Field(() => String)
  department: string

  @Column('text')
  @Field(() => String)
  city: string

  @Column('int', { nullable: true })
  @Field(() => Int, { nullable: true })
  postal_code?: number

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
  @ManyToOne(() => User, (user) => user.companies)
  @JoinColumn({ name: 'userID' })
  user: User

  @OneToMany(() => Order, (order) => order.companies, { eager: true })
  order: Order[]

  @ManyToOne(() => User, (user) => user.lastUpdateBy, { nullable: true, lazy: true })
  @JoinColumn({ name: 'lastUpdateBy' })
  @Field(() => User, { nullable: true })
  lastUpdateBy?: User

}
