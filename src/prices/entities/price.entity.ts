import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

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
  stock: number

  @Column('text', { array: true })
  @Field(() => [String])
  type: string[]

  @Column('text', { nullable: true })
  @Field(() => String, { nullable: true })
  description?: string

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
