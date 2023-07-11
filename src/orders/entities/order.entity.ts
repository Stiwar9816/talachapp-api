import { Column, CreateDateColumn, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
// GraphQL
import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
// Entity
import { Company } from 'src/companies/entities/company.entity';
import { User } from 'src/users/entities/user.entity';
import { Price } from 'src/prices/entities/price.entity';
import { Score } from 'src/scores/entities/score.entity';
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

  @Column('text', { nullable: true })
  @Field(() => String, {
    nullable: true,
    description: 'order status [waiting or completed]'
  })
  status?: string

  @Column('float', { nullable: true })
  @Field(() => Float, { nullable: true })
  total?: number

  @Column('text', {nullable: true})
  @Field(()=> String, { 
    nullable: true,
    description: ' id order api coneckta'
  })
  idOrderConekta?: string

  @CreateDateColumn({ type: 'timestamp with time zone' })
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
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

  @ManyToOne(() => Company, comapny => comapny.order, { lazy: true, eager: true })
  @Index('companyID-index')
  @Field(() => Company, {
    description: 'Relationship with the many-to-one companies table'
  })
  companies: Company

  @ManyToMany(() => Price, { lazy: true })
  @JoinTable()
  @Field(() => Price)
  prices: Price[];

  @OneToMany(()=> Score, score => score.orders, { lazy:true, nullable:true})
  @Field(()=> Score, { description: 'Order score'})
  score?: Score
}
