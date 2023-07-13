// Nest Common
import { Inject, UseGuards } from '@nestjs/common';
// GraphQL
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
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
import { PubSub } from 'graphql-subscriptions';
import { NoAuthAuthGuard } from './guards';

@Resolver(() => AuthResponde)
export class AuthResolver {
  constructor(
    @Inject('PUB_SUB') private readonly pubSub: PubSub,
    private readonly authService: AuthService,
  ) {}

  @Mutation(() => AuthResponde, {
    name: 'signup',
    description: 'Create a new user',
  })
  async signUp(
    @Args('signupInput') signupInput: SignupInput,
  ): Promise<AuthResponde> {
    const createUser = this.authService.signup(signupInput);
    this.pubSub.publish('newUser', { newUser: createUser });
    return createUser;
  }

  @Mutation(() => AuthResponde, {
    name: 'signin',
    description: 'User login',
  })
  async signIn(
    @Args('signinInput') siginInput: SigninInput,
  ): Promise<AuthResponde> {
    return this.authService.signin(siginInput);
  }

  @Query(() => AuthResponde, {
    name: 'revalidate',
    description: 'Validates the token of the logged in user',
  })
  @UseGuards(JwtAuthGuard)
  revalidateToken(
    @CurrentUser(/**[ValidRoles.admin]*/) user: User,
  ): AuthResponde {
    return this.authService.revalidateToken(user);
  }

  @Subscription(() => AuthResponde, {
    name: 'newUser',
    description: 'Subscribe to new users',
  })
  @UseGuards(NoAuthAuthGuard)
  subscribeNewUser(): AsyncIterator<AuthResponde> {
    return this.pubSub.asyncIterator('newUser');
  }
}
