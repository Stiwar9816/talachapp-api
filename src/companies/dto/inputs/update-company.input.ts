import { IsIn, IsOptional, IsUUID } from 'class-validator';
import { CreateCompanyInput } from './create-company.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType({
  description:
    'Diagram of the fields enabled to be able to be modified by the admin for a specific company',
})
export class UpdateCompanyInput extends PartialType(CreateCompanyInput) {
  @IsUUID()
  @Field(() => String, {
    description: 'Id automatically generated in integer format eg: 1,2,3..',
  })
  id: string;

  @IsIn(['Activo', 'Inactivo'])
  @IsOptional()
  @Field(() => String, {
    description:
      'Company status within the system "active (true) || inactive (false)"',
  })
  isActive?: string;

  @IsOptional()
  @IsIn(['Moral', 'Físico'])
  @Field(() => String, { nullable: true })
  tax_regime?: string;
}
