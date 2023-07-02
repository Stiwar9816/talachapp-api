// Nest Common
import { UseGuards } from '@nestjs/common';
// GraphQL
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
// Services
import { AuthService } from './auth.service';
// Types
import { AuthResponde } from './types/auth-response.type';
// Entity/Dto's
import { User } from 'src/users/entities/user.entity';
import { SignupInput, SigninInput } from './dto';
// Decorators
import { CurrentUser } from './decorators/current-user.decorator';
// Guards
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Resolver(() => AuthResponde)
export class AuthResolver {
  constructor(
    private readonly authService: AuthService
  ) { }

  @Mutation(() => AuthResponde, {
    name: 'signup',
    description: 'Create a new user'
  })
  async signUp(@Args('signupInput') signupInput: SignupInput): Promise<AuthResponde> {
    return this.authService.signup(signupInput)
  }

  @Mutation(() => AuthResponde, {
    name: 'signin',
    description: 'User login'
  })
  async signIn(@Args('signinInput') siginInput: SigninInput): Promise<AuthResponde> {
    return this.authService.signin(siginInput)
  }

  @Query(() => AuthResponde, {
    name: 'revalidate',
    description: 'Validates the token of the logged in user'
  })
  @UseGuards(JwtAuthGuard)
  revalidateToken(@CurrentUser(/**[ValidRoles.admin]*/) user: User): AuthResponde {
    return this.authService.revalidateToken(user)
  }
}
