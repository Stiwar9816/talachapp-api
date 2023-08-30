import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
// GraphQL
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
// Services
import { UsersService } from './users.service';
// Entity/Dto's
import { User } from './entities/user.entity';
import { UpdateUserInput } from './dto';
// Auth (Enums/Decorators/Guards)
import { UserRoles } from 'src/auth/enums/user-role.enum';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtAuthGuard, NoAuthAuthGuard } from 'src/auth/guards';
// Common / Args / utils
import { CompaniesIdArgs, UserRolesArgs } from 'src/common';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User], {
    name: 'users',
    description: 'Find all users',
  })
  @UseGuards(JwtAuthGuard)
  findAll(
    @Args() userRoles: UserRolesArgs,
    @CurrentUser([UserRoles.Administrador, UserRoles.superAdmin]) user: User,
  ): Promise<User[]> {
    return this.usersService.findAll(userRoles.roles);
  }

  @Query(() => User, {
    name: 'user',
    description: 'Search for a user by a unique ID',
  })
  @UseGuards(JwtAuthGuard)
  findOne(
    @Args('id', { type: () => String }, ParseUUIDPipe) id: string,
    @CurrentUser([UserRoles.Administrador, UserRoles.superAdmin]) user: User,
  ): Promise<User> {
    return this.usersService.findOneById(id);
  }

  @Query(() => User, {
    name: 'userByEmail',
    description: 'Search for a user by a unique Email',
  })
  @UseGuards(JwtAuthGuard)
  findOneByEmail(
    @Args('email', { type: () => String }) email: string,
    @CurrentUser([UserRoles.Administrador, UserRoles.superAdmin]) user: User,
  ): Promise<User> {
    return this.usersService.findOneByEmail(email);
  }

  @Mutation(() => User, {
    name: 'updateUser',
    description: 'Updates the data of a user by a unique ID',
  })
  @UseGuards(JwtAuthGuard)
  updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @CurrentUser([UserRoles.Administrador, UserRoles.superAdmin]) user: User,
    @Args() company?: CompaniesIdArgs,
  ): Promise<User> {
    return this.usersService.update(
      updateUserInput.id,
      updateUserInput,
      user,
      company,
    );
  }

  @Mutation(() => User, {
    name: 'blockUser',
    description: 'Inactivate a user',
  })
  @UseGuards(JwtAuthGuard)
  blockUser(
    @Args('id', { type: () => String }, ParseUUIDPipe) id: string,
    @CurrentUser([UserRoles.Administrador, UserRoles.superAdmin]) user: User,
  ): Promise<User> {
    return this.usersService.block(id, user);
  }

  @Mutation(() => User, {
    name: 'resetPassword',
    description: 'Reset password user',
  })
  @UseGuards(NoAuthAuthGuard)
  resetPassword(
    @Args('resetPassword', { type: () => String }) email: string,
  ): Promise<User> {
    return this.usersService.resetPassword(email);
  }

  @Mutation(() => User, {
    name: 'resetPasswordAuth',
    description: 'Reset password user authenticed',
  })
  @UseGuards(JwtAuthGuard)
  resetPasswordAuth(
    @Args('newPassword', { type: () => String }) password: string,
    @CurrentUser() user: User,
  ): Promise<User> {
    return this.usersService.resetPasswordAuth(password, user);
  }

  @Mutation(() => User, {
    name: 'updateUserToken',
    description: 'Updates the data of a user by a unique ID',
  })
  @UseGuards(JwtAuthGuard)
  updateUserToken(
    @Args('email', { type: () => String }) email: string,
    @Args('token', { type: () => String }) token: string,
    @CurrentUser() user: User,
  ): Promise<User> {
    return this.usersService.updateToken(email, token);
  }
}
