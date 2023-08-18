import { InputType, Field, Float } from '@nestjs/graphql';
import {
  IsArray,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { UserRoles } from 'src/auth/enums/user-role.enum';
import { Geofence } from 'src/companies/interface/geofence.interface';
@InputType()
export class CreateUserInput {
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  idFirebase?: string;

  @IsEmail()
  @Field(() => String, {
    description: 'User email',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @Field(() => String, {
    description: 'Full name of the user',
  })
  fullName: string;

  @IsNumber()
  @IsPositive()
  @Field(() => Float, {
    description: 'User phone',
  })
  phone: number;

  @IsString()
  @MinLength(6)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  @Field(() => String, {
    description: `
    User password that must have a minimum length of 6 digits
    and the password must have an Uppercase, lowercase letter and a number
    `,
  })
  password: string;

  @IsIn(['Activo', 'Inactivo'])
  @Field(() => String, {
    description:
      'User status in the system [ active (true) or inactive (false) ]',
  })
  isActive: string = 'Activo';

  @IsArray()
  @Field(() => [UserRoles], {
    description:
      'User role in the system [ Administrador, Talachero or Usuario ]',
  })
  roles: UserRoles[];

  @IsString()
  @IsOptional()
  @Field(() => String, {
    nullable: true,
    description:
      'The Federal Taxpayer Registry (rfc) is an alphanumeric code that the government uses to identify individuals and legal entities that engage in any economic activity, example: "HEGJ820506M10"',
  })
  rfc?: string;

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
