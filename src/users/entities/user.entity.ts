import { ObjectType, Field, Int } from '@nestjs/graphql';
import { CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, Column, Entity } from 'typeorm';


@ObjectType()
export class User {

  @PrimaryGeneratedColumn('increment')
  @Field(() => Int)
  id: number

  @Column('text')
  @Field(() => String)
  name: string

  @Column('int')
  @Field(() => Int)
  phone: number

  @Column('text')
  @Field(() => String)
  email: string

  @Column('text', {
    array: true,
    default: ['usuario']
  })
  @Field(() => String)
  role: string[]

  @Column('boolean')
  @Field(() => Boolean)
  isActive: boolean

  @Column('text')
  @Field(() => String)
  password: string

  @Column()
  date_validation: Date;

  @Column()
  last_access: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
