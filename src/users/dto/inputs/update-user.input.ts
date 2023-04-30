import { UserRoles } from 'src/auth/enums/user-role.enum';
import { CreateUserInput } from './create-user.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsInt, IsPositive, IsArray, IsOptional, IsBoolean } from 'class-validator';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @IsInt()
  @IsPositive()
  @Field(() => Int)
  id: number

  @IsArray()
  @IsOptional()
  @Field(() => [UserRoles], { nullable: true })
  roles?: UserRoles[]

  @IsBoolean()
  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  isActive?: boolean
}
