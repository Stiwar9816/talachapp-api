import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import { ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
export class Order {
  @PrimaryGeneratedColumn('increment')
  @Field(() => Int)
  id: number

  // @ManyToOne(() => User, (user) => user.order, { eager: true })
  // user: User
}
