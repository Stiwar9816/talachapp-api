import { ParseIntPipe, UseGuards } from '@nestjs/common';
// GraphQL
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
// Services
import { LocationService } from './location.service';
// Auth (Enums/Decorators/Guards)
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserRoles } from 'src/auth/enums/user-role.enum';
// Entity/Dto's(Inputs)
import { CreateLocationInput, UpdateLocationInput } from './dto';
import { Location } from './entities/location.entity';
import { User } from 'src/users/entities/user.entity';


@Resolver(() => Location)
@UseGuards(JwtAuthGuard)
export class LocationResolver {
  constructor(private readonly locationService: LocationService) { }

  @Mutation(() => Location, {
    name: 'createLocation',
    description: ''
  })
  createLocation(@Args('createLocationInput') createLocationInput: CreateLocationInput,
    @CurrentUser([UserRoles.Administrador, UserRoles.Talachero, UserRoles.Usuario, UserRoles.superAdmin]) user: User) {
    return this.locationService.create(createLocationInput, user);
  }

  @Query(() => [Location], {
    name: 'locations',
    description: ''
  })
  findAll() {
    return this.locationService.findAll();
  }

  @Query(() => Location, {
    name: 'location',
    description: ''
  })
  findOne(@Args('id', { type: () => Int }, ParseIntPipe) id: number,
    @CurrentUser([UserRoles.Administrador, UserRoles.Talachero, UserRoles.Usuario, UserRoles.superAdmin]) user: User
  ) {
    return this.locationService.findOne(id);
  }

  // @Mutation(() => Location, { name: 'updateLocation' })
  // updateLocation(@Args('updateLocationInput') updateLocationInput: UpdateLocationInput) {
  //   return this.locationService.update(updateLocationInput.id, updateLocationInput);
  // }

  @Mutation(() => Location, {
    name: 'removeLocation',
    description: 'remove location for userId'
  })
  removeLocation(@Args('id', { type: () => Int }, ParseIntPipe) id: number,
    @CurrentUser([UserRoles.Administrador, UserRoles.Talachero, UserRoles.Usuario, UserRoles.superAdmin]) user: User) {
    return this.locationService.remove(id);
  }
}
