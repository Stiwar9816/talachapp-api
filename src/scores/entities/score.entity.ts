import { ObjectType, Field, Float } from '@nestjs/graphql';
import { Order } from 'src/orders/entities/order.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'scores' })
@ObjectType({
  description:
    'Scheme where user rating information is stored for the services provided',
})
export class Score {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String, {
    description: 'Id automatically generated in integer format eg: 1,2,3..',
  })
  id: string;

  @Column('float4')
  @Field(() => Float, {
    description:
      'Rating that the user gives to the company or vice versa score from 1 to 5',
    nullable: true
  })
  rankClient?: number;

  @Column('float4')
  @Field(() => Float, {
    description:
      'Rating that the user gives to the company or vice versa score from 1 to 5',
    nullable: true
  })
  rankTalachero?: number;

  @Column('text', { nullable: true })
  @Field(() => String, {
    nullable: true,
    description: 'Quality of service provided',
  })
  quality?: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  // Relations

  @ManyToOne(() => Order, order => order.score, { lazy: true, eager: true, nullable: true })
  @Field(() => Order, { description: 'Order score', nullable: true })
  @JoinColumn({ name: 'scoreOrder' })
  orders?: Order


  @ManyToOne(() => User, (user) => user.scores, { eager: true })
  @Field(() => User, { description: 'User information' })
  @JoinColumn({ name: 'userID' })
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
}
