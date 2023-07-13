import { Field, Float, InputType } from '@nestjs/graphql';
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
import { randomPassword } from 'src/auth/utils/randomPassword';

@InputType({
	description: 'Diagram of the fields requested for the registration of a user',
})
export class SignupInput {
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
	@IsOptional()
	@Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
		message:
			'The password must have a Uppercase, lowercase letter and a number',
	})
	@Field(() => String, {
		description: `
        User password that must have a minimum length of 6 digits
        and the password must have an Uppercase, lowercase letter and a number
        `,
		defaultValue: randomPassword()
	})
	password?: string;

	@IsArray()
	@IsString({ each: true })
	@Field(() => [String], {
		description:
			'User roles which can be [ admin, user or talachero ] by default takes the user role',
	})
	roles: string[];

	@IsIn(['Activo', 'Inactivo'])
	@Field(() => String, {
		description:
			'User status in the system [ active (true) or inactive (false) ]',
	})
	isActive: string = 'Activo';
}
