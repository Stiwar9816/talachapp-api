import { IsIn, IsInt, IsOptional, IsPositive } from 'class-validator';
import { CreateCompanyInput } from './create-company.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import { ManyToOne } from 'typeorm';

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

  @IsIn(['Activo', 'Inactivo'])
  @IsOptional()
  @Field(() => String, {
    description: 'Company status within the system "active (true) || inactive (false)"'
  })
  isActive?: string
}
