import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { LocationService } from './location.service';
import { Location } from './entities/location.entity';
import { CreateLocationInput, UpdateLocationInput } from './dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { UserRoles } from 'src/auth/enums/user-role.enum';


@Resolver(() => Location)
@UseGuards(JwtAuthGuard)
export class LocationResolver {
  constructor(private readonly locationService: LocationService) {}

  @Mutation(() => Location)
  createLocation(@Args('createLocationInput') createLocationInput: CreateLocationInput,
  @CurrentUser([UserRoles.Administrador,UserRoles.Talachero, UserRoles.Usuario, UserRoles.superAdmin]) user:User)
   {
    return this.locationService.create(createLocationInput, user);
  }

  @Query(() => [Location], { name: 'location' })
  findAll() {
    return this.locationService.findAll();
  }

  @Query(() => Location, { name: 'location' })
  findOne(@Args('id', { type: () => Int }) id: number, 
  @CurrentUser([UserRoles.Administrador,UserRoles.Talachero, UserRoles.Usuario, UserRoles.superAdmin]) user: User
    ) {
    return this.locationService.findOne(user.id);
  }

  @Mutation(() => Location)
  updateLocation(@Args('updateLocationInput') updateLocationInput: UpdateLocationInput) {
    return this.locationService.update(updateLocationInput.id, updateLocationInput);
  }

  @Mutation(() => Location,{
    name: 'removeLocation',
    description: 'remove location for userId'
  })
  removeLocation(@Args('id', { type: () => Int }) id: number, 
  @CurrentUser([UserRoles.Administrador,UserRoles.Talachero, UserRoles.Usuario, UserRoles.superAdmin]) user: User) {
    return this.locationService.remove(user.id);
  }
}
