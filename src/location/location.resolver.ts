import { Inject, ParseUUIDPipe, UseGuards } from '@nestjs/common';
// GraphQL
import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  Subscription,
} from '@nestjs/graphql';
// Services
import { LocationService } from './location.service';
// Auth (Enums/Decorators/Guards)
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserRoles } from 'src/auth/enums/user-role.enum';
import { JwtAuthGuard, NoAuthAuthGuard } from 'src/auth/guards';
// Entity/Dto's(Inputs)
import { CreateLocationInput, UpdateLocationInput } from './dto';
import { Location } from './entities/location.entity';
import { User } from 'src/users/entities/user.entity';
import { PubSub } from 'graphql-subscriptions';

@Resolver(() => Location)
export class LocationResolver {
  constructor(
    @Inject('PUB_SUB') private readonly pubSub: PubSub,
    private readonly locationService: LocationService,
  ) {}

  @Mutation(() => Location, {
    name: 'createLocation',
    description: '',
  })
  @UseGuards(JwtAuthGuard)
  createLocation(
    @Args('createLocationInput') createLocationInput: CreateLocationInput,
    @CurrentUser([
      UserRoles.Administrador,
      UserRoles.Talachero,
      UserRoles.Usuario,
      UserRoles.superAdmin,
    ])
    user: User,
  ) {
    const createLocation = this.locationService.create(
      createLocationInput,
      user,
    );
    this.pubSub.publish('newLocation', { newLocation: createLocation });
    return createLocation;
  }

  @Query(() => [Location], {
    name: 'locations',
    description: '',
  })
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.locationService.findAll();
  }

  @Query(() => Location, {
    name: 'location',
    description: '',
  })
  @UseGuards(JwtAuthGuard)
  findOne(
    @Args('id', { type: () => String }, ParseUUIDPipe) id: string,
    @CurrentUser([
      UserRoles.Administrador,
      UserRoles.Talachero,
      UserRoles.Usuario,
      UserRoles.superAdmin,
    ])
    user: User,
  ) {
    return this.locationService.findOne(user.id);
  }

  // @Mutation(() => Location, { name: 'updateLocation' })
  // updateLocation(@Args('updateLocationInput') updateLocationInput: UpdateLocationInput) {
  //   return this.locationService.update(updateLocationInput.id, updateLocationInput);
  // }

  @Mutation(() => Location, {
    name: 'removeLocation',
    description: 'remove location for userId',
  })
  @UseGuards(JwtAuthGuard)
  removeLocation(
    @Args('id', { type: () => String }, ParseUUIDPipe) id: string,
    @CurrentUser([
      UserRoles.Administrador,
      UserRoles.Talachero,
      UserRoles.Usuario,
      UserRoles.superAdmin,
    ])
    user: User,
  ) {
    return this.locationService.remove(user.id);
  }

  @Subscription(() => Location, {
    name: 'newLocation',
    description: 'Subscribe to new scores',
  })
  @UseGuards(NoAuthAuthGuard)
  subscribeNewLocation(): AsyncIterator<Location> {
    return this.pubSub.asyncIterator('newLocation');
  }
}
