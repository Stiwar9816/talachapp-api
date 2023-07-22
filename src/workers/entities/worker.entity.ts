import { ObjectType, Field, Float } from '@nestjs/graphql';
import { Company } from 'src/companies/entities/company.entity';
import { Geofence } from 'src/companies/interface/geofence.interface';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'workers' })
@ObjectType()
export class Worker {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String, {
    description: 'Id automatically generated in integer format eg: 1,2,3..',
  })
  id: string;

  @Column('text')
  @Field(() => String)
  fullName: string;

  @Column('text', { unique: true })
  @Field(() => String)
  email: string;

  @Column('bigint')
  @Field(() => Float)
  phone: number;

  @Column('text')
  @Field(() => String, {
    description: 'User status in the system [ active or inactive ]',
  })
  isActive: string;

  @Column('text', {
    array: true,
    nullable: true,
  })
  @Field(() => [String], { nullable: true })
  geofence?: Geofence[];

  @Column('float', { nullable: true })
  @Field(() => Float, { nullable: true })
  lat?: number;

  @Column('float', { nullable: true })
  @Field(() => Float, { nullable: true })
  lng?: number;

  // Relations
  @ManyToOne(() => Company, (companies) => companies.worker, { lazy: true })
  @JoinColumn({ name: 'company' })
  @Field(() => Company)
  companies: Company;

  @ManyToOne(() => User, (user) => user.worker)
  @JoinColumn({ name: 'createBy' })
  user: User;

  @ManyToOne(() => User, (user) => user.lastUpdateBy, {
    nullable: true,
    lazy: true,
  })
  @JoinColumn({ name: 'lastUpdateBy' })
  @Field(() => User, {
    nullable: true,
    description:
      'Returns the information of the user who made the last update of the company data',
  })
  lastUpdateBy?: User;
}
