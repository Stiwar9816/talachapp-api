import { Inject, ParseIntPipe, UseGuards } from '@nestjs/common';
// GraphQL
import { Resolver, Query, Mutation, Args, Int, Subscription } from '@nestjs/graphql';
// Services
import { LocationService } from './location.service';
// Auth (Enums/Decorators/Guards)
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserRoles } from 'src/auth/enums/user-role.enum';
import { JwtAuthGuard } from 'src/auth/guards';
// Entity/Dto's(Inputs)
import { CreateLocationInput, UpdateLocationInput } from './dto';
import { Location } from './entities/location.entity';
import { User } from 'src/users/entities/user.entity';
import { PubSub } from 'graphql-subscriptions';

@Resolver(() => Location)
@UseGuards(JwtAuthGuard)
export class LocationResolver {
  constructor(
    @Inject('PUB_SUB') private readonly pubSub: PubSub,
    private readonly locationService: LocationService
  ) { }

  @Mutation(() => Location, {
    name: 'createLocation',
    description: ''
  })
  createLocation(@Args('createLocationInput') createLocationInput: CreateLocationInput,
    @CurrentUser([UserRoles.Administrador, UserRoles.Talachero, UserRoles.Usuario, UserRoles.superAdmin]) user: User) {
    const createLocation = this.locationService.create(createLocationInput, user);
    this.pubSub.publish('newLocation', { newLocation: createLocation })
    return createLocation
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
    return this.locationService.findOne(user.id);
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
    return this.locationService.remove(user.id);
  }

  @Subscription(() => Location, {
    name: 'newLocation',
    description: 'Subscribe to new scores'
  })
  subscribeNewLocation(): AsyncIterator<Location> {
    return this.pubSub.asyncIterator('newLocation')
  }
}