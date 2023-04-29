import { InputType, Int, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsInt, IsPositive, IsOptional } from 'class-validator';

@InputType()
export class CreateCompanyInput {

  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  name_company: string

  @IsInt()
  @IsPositive()
  @Field(() => Int)
  phone: number

  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  rfc?: string

  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  cfdi?: string

  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  bussiness_name: string

  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  address?: string

  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  department: string

  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  city: string

  @IsInt()
  @IsOptional()
  @IsPositive()
  @Field(() => Int, { nullable: true })
  postal_code?: number
}
