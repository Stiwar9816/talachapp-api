import { ParseIntPipe, UseGuards } from '@nestjs/common';
// GraphQL
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
// Services
import { UsersService } from './users.service';
// Entity/Dto's
import { User } from './entities/user.entity';
import { UserRolesArgs, UpdateUserInput } from './dto';
// Auth (Enums/Decorators/Guards)
import { UserRoles } from 'src/auth/enums/user-role.enum';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Resolver(() => User)
@UseGuards(JwtAuthGuard)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) { }

  @Query(() => [User], { name: 'users', description: 'Find all users' })
  findAll(
    @Args() userRoles: UserRolesArgs,
    @CurrentUser([UserRoles.ADMIN, UserRoles.SUPERADMIN]) user: User
  ): Promise<User[]> {
    return this.usersService.findAll(userRoles.roles);
  }

  @Query(() => User, { name: 'user', description: 'Search for a user by a unique ID' })
  findOne(
    @Args('id', { type: () => Int }, ParseIntPipe) id: number,
    @CurrentUser([UserRoles.ADMIN, UserRoles.SUPERADMIN]) user: User
  ): Promise<User> {
    return this.usersService.findOneById(id);
  }

  @Mutation(() => User, { name: 'updateUser', description: 'Updates the data of a user by a unique ID' })
  updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @CurrentUser([UserRoles.ADMIN, UserRoles.SUPERADMIN]) user: User
  ): Promise<User> {
    return this.usersService.update(updateUserInput.id, updateUserInput, user)
  }

  @Mutation(() => User, { name: 'blockUser', description: 'Inactivate a user' })
  blockUser(
    @Args('id', { type: () => Int }, ParseIntPipe) id: number,
    @CurrentUser([UserRoles.ADMIN, UserRoles.SUPERADMIN]) user: User
  ): Promise<User> {
    return this.usersService.block(id, user);
  }
}
