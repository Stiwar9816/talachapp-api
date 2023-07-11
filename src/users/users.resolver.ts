import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
// GraphQL
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
// Services
import { UsersService } from './users.service';
// Entity/Dto's
import { User } from './entities/user.entity';
import { UserRolesArgs, UpdateUserInput } from './dto';
// Auth (Enums/Decorators/Guards)
import { UserRoles } from 'src/auth/enums/user-role.enum';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtAuthGuard, NoAuthAuthGuard } from 'src/auth/guards';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) { }

  @Query(() => [User], {
    name: 'users',
    description: 'Find all users'
  })
  @UseGuards(JwtAuthGuard)
  findAll(
    @Args() userRoles: UserRolesArgs,
    @CurrentUser([UserRoles.Administrador, UserRoles.superAdmin]) user: User
  ): Promise<User[]> {
    return this.usersService.findAll(userRoles.roles);
  }

  @Query(() => User, {
    name: 'user',
    description: 'Search for a user by a unique ID'
  })
  @UseGuards(JwtAuthGuard)
  findOne(
    @Args('id', { type: () => String }, ParseUUIDPipe) id: string,
    @CurrentUser([UserRoles.Administrador, UserRoles.superAdmin]) user: User
  ): Promise<User> {
    return this.usersService.findOneById(id);
  }

  @Mutation(() => User, {
    name: 'updateUser',
    description: 'Updates the data of a user by a unique ID'
  })
  @UseGuards(JwtAuthGuard)
  updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @CurrentUser([UserRoles.Administrador, UserRoles.superAdmin]) user: User
  ): Promise<User> {
    return this.usersService.update(updateUserInput.id, updateUserInput, user)
  }

  @Mutation(() => User, {
    name: 'blockUser',
    description: 'Inactivate a user'
  })
  @UseGuards(JwtAuthGuard)
  blockUser(
    @Args('id', { type: () => String }, ParseUUIDPipe) id: string,
    @CurrentUser([UserRoles.Administrador, UserRoles.superAdmin]) user: User
  ): Promise<User> {
    return this.usersService.block(id, user);
  }

  @Mutation(() => User, { name: 'resetPassword', description: 'Reset password user' })
  @UseGuards(NoAuthAuthGuard)
  resetPassword(
    @Args('resetPassword', { type: () => String }) email: string
  ): Promise<User> {
    return this.usersService.resetPassword(email)
  }

  @Mutation(() => User, { name: 'resetPasswordAuth', description: 'Reset password user authenticed' })
  @UseGuards(JwtAuthGuard)
  resetPasswordAuth(
    @Args('newPassword', { type: () => String }) password: string,
    @CurrentUser() user: User
  ): Promise<User> {
    return this.usersService.resetPasswordAuth(password, user)
  }
}
