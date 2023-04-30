import { ObjectType, Field, Int } from '@nestjs/graphql';
import { CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, Column, Entity } from 'typeorm';

@ObjectType()
export class Score {

  @PrimaryGeneratedColumn('increment')
  @Field(() => Int)
  id: number

  @Column('int')
  @Field(() => Int)
  rank: number

  @Column('text')
  @Field(() => String)
  quality: string

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
