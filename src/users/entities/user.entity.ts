import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { Order } from 'src/orders/entities/order.entity';
@Entity({ name: 'users' })
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('increment')
  @Field(() => Int)
  id: number

  @Column('text')
  @Field(() => String)
  fullName: string

  @Column('float', { nullable: true })
  @Field(() => Float, { nullable: true })
  phone?: number

  @Column('text', { unique: true })
  @Field(() => String)
  email: string

  @Column('text', {
    array: true,
    default: ['usuario']
  })
  @Field(() => [String])
  roles: string[]

  @Column('text')
  @Field(() => String)
  password: string

  @Column('bool', {
    default: true
  })
  @Field(() => Boolean)
  isActive: boolean

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => User, (user) => user.lastUpdateBy, { nullable: true, lazy: true })
  @JoinColumn({ name: 'lastUpdateBy' })
  @Field(() => User, { nullable: true })
  lastUpdateBy?: User

  // @OneToMany(() => Order, (order) => order.user)
  // order: Order
}
