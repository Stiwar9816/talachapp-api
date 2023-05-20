import { UserRoles } from 'src/auth/enums/user-role.enum';
import { CreateUserInput } from './create-user.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsInt, IsPositive, IsArray, IsOptional, IsBoolean, IsIn } from 'class-validator';

@InputType({
  description: 'Diagram of the fields enabled to be able to be modified by the system admin for a specific user'
})
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @IsInt()
  @IsPositive()
  @Field(() => Int, {
    description: 'Id automatically generated in integer format eg: 1,2,3..'
  })
  id: number

  @IsArray()
  @IsOptional()
  @Field(() => [UserRoles], {
    nullable: true,
    description: 'User roles which can be [ admin, user or talachero ] by default takes the user role'
  })
  roles?: UserRoles[]

  @IsOptional()
  @IsIn(['Activo', 'Inactivo'])
  @Field(() => String, {
    description: 'User status in the system [ active (true) or inactive (false) ]'
  })
  isActive?: string
}
