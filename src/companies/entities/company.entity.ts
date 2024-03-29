import {
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  Column,
  Entity,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
// GraphQL
import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
// Entity
import { Order } from 'src/orders/entities/order.entity';
import { User } from 'src/users/entities/user.entity';
import { Geofence } from '../interface/geofence.interface';
import { Price } from 'src/prices/entities/price.entity';

@Entity({ name: 'companies' })
@ObjectType({
  description: `scheme of what the companies table looks like where the information of each company or talachero will be stored`,
})
export class Company {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String, {
    description: 'Id automatically generated in integer format eg: 1,2,3..',
  })
  id: string;

  @Column('text', { unique: true })
  @Field(() => String, {
    description: 'company name or talachero',
  })
  name_company: string;

  @Column('bigint')
  @Field(() => Float, {
    description: 'company phone or talachero',
  })
  phone: number;

  @Column('text', { nullable: true, unique: true })
  @Field(() => String, {
    nullable: true,
    description:
      'The Federal Taxpayer Registry (rfc) is an alphanumeric code that the government uses to identify individuals and legal entities that engage in any economic activity, example: "HEGJ820506M10"',
  })
  rfc?: string;

  @Column('text', { unique: true })
  @Field(() => String, {
    description: 'business name of the company',
  })
  bussiness_name: string;

  @Column('text', { nullable: true })
  @Field(() => String, {
    nullable: true,
    description: 'Company address',
  })
  address?: string;

  @Column('text')
  @Field(() => String, {
    description: 'State where the company is located',
  })
  department: string;

  @Column('text')
  @Field(() => String, {
    description: 'City where the company is located',
  })
  city: string;

  @Column('int', { nullable: true })
  @Field(() => Int, {
    nullable: true,
    description: 'Company Postal Code',
  })
  postal_code?: number;

  @Column('text', {
    default: 'Inactivo',
  })
  @Field(() => String, {
    description: 'Company status within the system "active || inactive "',
  })
  isActive: string;

  @Column('text', { nullable: true })
  @Field(() => String, { nullable: true })
  tax_regime?: string;

  @Column('text', {
    array: true,
    nullable: true,
  })
  @Field(() => [String], { nullable: true })
  geofence?: Geofence[];

  @Column('float')
  @Field(() => Float)
  lat: number;

  @Column('float')
  @Field(() => Float)
  lng: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => User, (user) => user.companiesWorker, {
    lazy: true,
    eager: true,
    nullable: true,
  })
  @JoinColumn({ name: 'companiesWorker' })
  @Field(() => [User], {
    nullable: true,
    description: 'One-to-many relationship with user table',
  })
  userWorker?: User[];

  @ManyToOne(() => User, (user) => user.companies)
  @JoinColumn({ name: 'userId' })
  @Field(() => User)
  user: User;

  @OneToMany(() => Order, (order) => order.companies)
  @Field(() => [Order])
  order: Order[];

  @OneToMany(() => Price, (price) => price.companies)
  @Field(() => [Price])
  price: Price[];

  @ManyToOne(() => User, (user) => user.lastUpdateBy, {
    nullable: true,
    lazy: true,
  })
  @JoinColumn({ name: 'lastUpdateBy' })
  @Field(() => User, {
    nullable: true,
    description:
      'Returns the information of the user who made the last update of the company data',
  })
  lastUpdateBy?: User;
}
