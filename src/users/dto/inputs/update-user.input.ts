import { CreateUserInput } from './create-user.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsInt, IsPositive, IsOptional, IsIn, IsArray } from 'class-validator';
import { UserRoles } from 'src/auth/enums/user-role.enum';

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
    description: 'User role in the system [ Administrador, Talachero or Usuario ]'
  })
  roles?: UserRoles[]

  @IsOptional()
  @IsIn(['Activo', 'Inactivo'])
  @Field(() => String, {
    description: 'User status in the system [ active (true) or inactive (false) ]'
  })
  isActive?: string
}
