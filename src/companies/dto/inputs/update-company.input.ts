import { IsInt, IsPositive } from 'class-validator';
import { CreateCompanyInput } from './create-company.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateCompanyInput extends PartialType(CreateCompanyInput) {
  @IsInt()
  @IsPositive()
  @Field(() => Int)
  id: number
}
