import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
// GraphQL
import { ObjectType, Field, Float } from '@nestjs/graphql';
// Entity
import { Company } from 'src/companies/entities/company.entity';
import { Score } from 'src/scores/entities/score.entity';
import { Price } from 'src/prices/entities/price.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Location } from 'src/location/entities/location.entity';
import { Worker } from 'src/workers/entities/worker.entity';
@Entity({ name: 'users' })
@ObjectType({
  description: 'Schema where the information of the system users is stored',
})
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String, {
    description: 'Id automatically generated in integer format eg: 1,2,3..',
  })
  id: string;

  @Column('text', { nullable: true })
  @Field(() => String, { nullable: true })
  idFirebase?: string;

  @Column('text')
  @Field(() => String, {
    description: 'Full name of the user',
  })
  fullName: string;

  @Column('bigint')
  @Field(() => Float, {
    description: 'User phone',
  })
  phone: number;

  @Column('text', { unique: true })
  @Field(() => String, {
    description: 'User email',
  })
  email: string;

  @Column('text', { nullable: true, unique: true })
  @Field(() => String, {
    nullable: true,
    description:
      'The Federal Taxpayer Registry (rfc) is an alphanumeric code that the government uses to identify individuals and legal entities that engage in any economic activity, example: "HEGJ820506M10"',
  })
  rfc?: string;

  @Column('text', { array: true })
  @Field(() => [String], {
    description:
      'User roles which can be [ admin, user or talachero ] by default takes the user role',
  })
  roles: string[];

  @Column('text')
  @Field(() => String, {
    description: `
    User password that must have a minimum length of 6 digits
    and the password must have an Uppercase, lowercase letter and a number
    `,
  })
  password: string;

  @Column('text', {
    default: 'Activo',
  })
  @Field(() => String, {
    description: 'User status in the system [ active or inactive ]',
  })
  isActive: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
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

  @OneToMany(() => Company, (company) => company.user)
  @Field(() => Company, {
    description: 'One-to-many relationship with company table',
  })
  companies: Company;

  @OneToMany(() => Price, (price) => price.user)
  @Field(() => Price, {
    description: 'One-to-many relationship with price table',
  })
  prices: Price;

  @OneToMany(() => Score, (score) => score.user)
  @Field(() => Score, {
    description: 'One-to-many relationship with score table',
  })
  scores: Score;

  @OneToMany(() => Order, (order) => order.user)
  @Field(() => Order, {
    description: 'One-to-many relationshi p with order table',
  })
  orders: Order;

  @OneToMany(() => Location, (location) => location.user)
  @Field(() => Location, {
    nullable: true,
    description: 'One-to-many relationship with order table',
  })
  location?: Location;

  @OneToMany(() => Worker, (worker) => worker.user)
  @Field(() => Worker, {
    description: 'One-to-many relationship with worker table',
  })
  worker: Worker;

  // Convertimos los datos del email a minúsculas
  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
    if (this.roles[0] === 'Talachero') {
      this.isActive = 'Inactivo';
    }
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.email = this.email.toLowerCase().trim();
  }
}
