import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

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

  // Relations
  @ManyToOne(() => User, (user) => user.scores, { eager: true })
  @JoinColumn({ name: 'userID' })
  user: User[]

  @ManyToOne(() => User, (user) => user.lastUpdateBy, { nullable: true, lazy: true })
  @JoinColumn({ name: 'lastUpdateBy' })
  @Field(() => User, { nullable: true })
  lastUpdateBy?: User
}
