import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'scores' })
@ObjectType({
  description: 'Scheme where user rating information is stored for the services provided'
})
export class Score {

  @PrimaryGeneratedColumn('increment')
  @Field(() => Int, {
    description: 'Id automatically generated in integer format eg: 1,2,3..'
  })
  id: number

  @Column('int')
  @Field(() => Int, {
    description: 'Rating that the user gives to the company or vice versa score from 1 to 5'
  })
  rank: number

  @Column('text', { nullable: true })
  @Field(() => String, {
    nullable: true,
    description: 'Quality of service provided'
  })
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
  @Field(() => User, {
    nullable: true,
    description: 'Returns the information of the user who made the last update of the company data'
  })
  lastUpdateBy?: User
}
