import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator';
import { CreateCompanyInput } from './create-company.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType({
  description: 'Diagram of the fields enabled to be able to be modified by the admin for a specific company'
})
export class UpdateCompanyInput extends PartialType(CreateCompanyInput) {
  @IsInt()
  @IsPositive()
  @Field(() => Int, {
    description: 'Id automatically generated in integer format eg: 1,2,3..'
  })
  id: number

  @IsString()
  @IsOptional()
  @Field(() => String, {
    description: 'Company status within the system "active (true) || inactive (false)"'
  })
  isActive?: string
}
