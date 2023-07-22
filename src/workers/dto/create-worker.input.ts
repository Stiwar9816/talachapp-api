import { InputType, Field, Float } from '@nestjs/graphql';
import {
  IsArray,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { Geofence } from 'src/companies/interface/geofence.interface';

@InputType()
export class CreateWorkerInput {
  @IsString()
  @IsNotEmpty()
  @Field(() => String, {
    description: 'Worker Name',
  })
  fullName: string;

  @IsEmail()
  @Field(() => String, {
    description: 'Worker Email',
  })
  email: string;

  @IsNumber()
  @IsPositive()
  @Field(() => Float, {
    description: 'Worker phone',
  })
  phone: number;

  @IsIn(['Activo', 'Inactivo'])
  @IsOptional()
  @Field(() => String, {
    defaultValue: 'Activo',
    nullable: true,
    description:
      'User status in the system [ active (true) or inactive (false) ]',
  })
  isActive?: string = 'Activo';

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @Field(() => [String], { nullable: true })
  geofence?: Geofence[];

  @IsNumber()
  @IsOptional()
  @Field(() => Float, { nullable: true })
  lat?: number;

  @IsNumber()
  @IsOptional()
  @Field(() => Float, { nullable: true })
  lng?: number;
}
