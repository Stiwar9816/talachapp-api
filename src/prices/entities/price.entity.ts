import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { Company } from 'src/companies/entities/company.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'prices' })
@ObjectType({
  description: `
  Scheme where the information about the company's inventory is saved,
  it can be saved regarding products, 
  services or fixed costs that are handled internally
  `,
})
export class Price {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String, {
    description: 'Id automatically generated in integer format eg: 1,2,3..',
  })
  id: string;

  @Column('text')
  @Field(() => String, {
    description: 'Name of the product, service or fixed cost',
  })
  name: string;

  @Column('float')
  @Field(() => Float, {
    description: 'Assigned value for a product, service or a fixed cost',
  })
  price: number;

  @Column('int', { nullable: true })
  @Field(() => Int, {
    nullable: true,
    description: 'Quantity of the price or product in inventory',
  })
  stock?: number;

  @Column('text')
  @Field(() => String, {
    description:
      'Type of price which can be [ product, service or fixed cost ]',
  })
  type: string;

  @Column('text', { nullable: true })
  @Field(() => String, {
    nullable: true,
    description:
      'Description of the added elements [ products, services or fixed costs ]',
  })
  description?: string;

  @Column('text', { nullable: true })
  @Field(() => String, {
    nullable: true,
    description: 'image of price type product',
  })
  image?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.prices, { eager: true })
  @JoinColumn({ name: 'createBy' })
  @Field(() => User)
  user: User;

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

  @ManyToOne(() => Company, (comapny) => comapny.order, {
    lazy: true,
    eager: true,
    nullable: true,
  })
  @Index('companyId')
  @JoinColumn({ name: 'company' })
  @Field(() => Company, {
    nullable: true,
    description: 'Relationship with the many-to-one companies table',
  })
  companies?: Company;
}
