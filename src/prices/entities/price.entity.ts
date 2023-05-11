import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'prices' })
@ObjectType({
  description:
    `
  Scheme where the information about the company's inventory is saved,
  it can be saved regarding products, 
  services or fixed costs that are handled internally
  `
})
export class Price {

  @PrimaryGeneratedColumn('increment')
  @Field(() => Int, {
    description: 'Id automatically generated in integer format eg: 1,2,3..'
  })
  id: number

  @Column('text', { unique: true })
  @Field(() => String, {
    description: 'Name of the product, service or fixed cost'
  })
  name: string

  @Column('float')
  @Field(() => Float, {
    description: 'Assigned value for a product, service or a fixed cost'
  })
  price: number

  @Column('int')
  @Field(() => Int, {
    description: 'Quantity of the price or product in inventory'
  })
  stock?: number

  @Column('text')
  @Field(() => String, {
    description: 'Type of price which can be [ product, service or fixed cost ]'
  })
  type: string

  @Column('text', { nullable: true })
  @Field(() => String, {
    nullable: true,
    description: 'Description of the added elements [ products, services or fixed costs ]'
  })
  description?: string

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.prices)
  @JoinColumn({ name: 'createBy' })
  user: User

  @ManyToOne(() => User, (user) => user.lastUpdateBy, { nullable: true, lazy: true })
  @JoinColumn({ name: 'lastUpdateBy' })
  @Field(() => User, {
    nullable: true,
    description: 'Returns the information of the user who made the last update of the company data'
  })
  lastUpdateBy?: User
}
