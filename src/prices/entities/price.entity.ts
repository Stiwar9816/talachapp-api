import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { Order } from 'src/orders/entities/order.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, CreateDateColumn, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'prices' })
@ObjectType()
export class Price {

  @PrimaryGeneratedColumn('increment')
  @Field(() => Int)
  id: number

  @Column('text', { unique: true })
  @Field(() => String)
  name: string

  @Column('float')
  @Field(() => Float)
  price: number

  @Column('int')
  @Field(() => Int)
  stock?: number

  @Column('text')
  @Field(() => String)
  type: string

  @Column('text', { nullable: true })
  @Field(() => String, { nullable: true })
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
  @Field(() => User, { nullable: true })
  lastUpdateBy?: User
}
