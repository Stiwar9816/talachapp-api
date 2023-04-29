import { ObjectType, Field, Int } from '@nestjs/graphql';
import { CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, Column, Entity } from 'typeorm';

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
