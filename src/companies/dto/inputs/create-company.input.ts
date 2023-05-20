import { InputType, Int, Field, Float } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsInt, IsPositive, IsOptional, IsIn, IsNumber, IsArray } from 'class-validator';
import { Geofence } from 'src/companies/interface/geofence.interface';

@InputType({
  description: 'Diagram of the information expected to create a new company/talacheros'
})
export class CreateCompanyInput {

  @IsString()
  @IsNotEmpty()
  @Field(() => String, {
    description: 'company name or talachero'
  })
  name_company: string

  @IsNumber()
  @IsPositive()
  @Field(() => Float, {
    description: 'company phone or talachero'
  })
  phone: number

  @IsString()
  @IsOptional()
  @Field(() => String, {
    nullable: true,
    description: 'The Federal Taxpayer Registry (rfc) is an alphanumeric code that the government uses to identify individuals and legal entities that engage in any economic activity, example: "HEGJ820506M10"'
  })
  rfc?: string

  @IsString()
  @IsOptional()
  @Field(() => String, {
    nullable: true,
    description: 'The Digital Fiscal Receipt via Internet, or CFDI for its acronym, is how the electronic invoice is normally known.'
  })
  cfdi?: string

  @IsString()
  @IsNotEmpty()
  @Field(() => String, {
    description: 'business name of the company'
  })
  bussiness_name: string

  @IsString()
  @IsOptional()
  @Field(() => String, {
    nullable: true,
    description: 'Company address'
  })
  address?: string

  @IsString()
  @IsNotEmpty()
  @Field(() => String, {
    description: 'State where the company is located'
  })
  department: string

  @IsString()
  @IsNotEmpty()
  @Field(() => String, {
    description: 'City where the company is located'
  })
  city: string

  @IsInt()
  @IsOptional()
  @IsPositive()
  @Field(() => Int, {
    nullable: true,
    description: 'Company Postal Code'
  })
  postal_code?: number

  @IsIn(['Activo', 'Inactivo'])
  @Field(() => String)
  isActive: string = 'Inactivo'

  @IsArray()
  @IsOptional()
  @Field(() => [Float], { nullable: true })
  geofence?: Geofence[]
}
