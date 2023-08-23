import { CreateUserInput } from './create-user.input';
import { InputType, Field, PartialType, Float } from '@nestjs/graphql';
import {
  IsOptional,
  IsIn,
  IsArray,
  IsUUID,
  IsNumber,
  IsString,
} from 'class-validator';
import { UserRoles } from 'src/auth/enums/user-role.enum';
import { Geofence } from 'src/companies/interface/geofence.interface';

@InputType({
  description:
    'Diagram of the fields enabled to be able to be modified by the system admin for a specific user',
})
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @IsUUID()
  @Field(() => String, {
    description: 'Id automatically generated in integer format eg: 1,2,3..',
  })
  id: string;

  @IsArray()
  @IsOptional()
  @Field(() => [UserRoles], {
    nullable: true,
    description:
      'User role in the system [ Administrador, Talachero or Usuario ]',
  })
  roles?: UserRoles[];

  @IsOptional()
  @IsIn(['Activo', 'Inactivo'])
  @Field(() => String, {
    description:
      'User status in the system [ active (true) or inactive (false) ]',
  })
  isActive?: string;

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
