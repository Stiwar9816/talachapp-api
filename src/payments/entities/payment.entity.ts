import { CreateDateColumn, Entity, UpdateDateColumn, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from 'typeorm';
// GraphQL
import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
// Entity
import { User } from 'src/users/entities/user.entity';

@Entity({ name: 'payments' })
@ObjectType()
export class Payment {

  @PrimaryGeneratedColumn('increment')
  @Field(() => Int)
  id: number

  @Column('text')
  @Field(() => String)
  toll: string

  @Column('text')
  @Field(() => String)
  transfer: string

  @Column('text')
  @Field(() => String)
  banner: string

  @Column('text')
  @Field(() => String)
  card_type: string

  @Column('text')
  @Field(() => String)
  bank_name: string

  @Column('float')
  @Field(() => Float)
  total: number

  @Column('text', {
    array: true,
    default: ['espera']
  })
  @Field(() => String)
  state: string[]

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.payments)
  @JoinColumn({ name: 'userID' })
  user: User
}
