import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'scores' })
@ObjectType()
export class Score {

  @PrimaryGeneratedColumn('increment')
  @Field(() => Int)
  id: number

  @Column('int')
  @Field(() => Int)
  rank: number

  @Column('text', { nullable: true })
  @Field(() => String, { nullable: true })
  quality?: string

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
