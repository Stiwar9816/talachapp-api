import { Resolver, Query, Mutation, Args, Subscription } from '@nestjs/graphql';
import { WorkersService } from './workers.service';
import { Worker } from './entities/worker.entity';
import { CreateWorkerInput, UpdateWorkerInput } from './dto';
import { Inject, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserRoles } from 'src/auth/enums/user-role.enum';
import { User } from 'src/users/entities/user.entity';
import { JwtAuthGuard, NoAuthAuthGuard } from 'src/auth/guards';
import { CompaniesIdArgs } from 'src/orders/dto';

@Resolver(() => Worker)
export class WorkersResolver {
  constructor(
    @Inject('PUB_SUB') private readonly pubSub: PubSub,
    private readonly workersService: WorkersService,
  ) {}

  @Mutation(() => Worker, {
    name: 'createWorker',
  })
  @UseGuards(JwtAuthGuard)
  createWorker(
    @Args('createWorkerInput') createWorkerInput: CreateWorkerInput,
    @CurrentUser([UserRoles.Administrador, UserRoles.superAdmin])
    user: User,
    @Args() company?: CompaniesIdArgs,
  ) {
    const createWorker = this.workersService.create(
      createWorkerInput,
      user,
      company,
    );
    this.pubSub.publish('newWorker', { newWorker: createWorker });
    return createWorker;
  }

  @Query(() => [Worker], { name: 'workers' })
  @UseGuards(JwtAuthGuard)
  findAll(
    @CurrentUser([
      UserRoles.Administrador,
      UserRoles.superAdmin,
      UserRoles.centroTalachero,
      UserRoles.Talachero,
    ])
    user: User,
  ) {
    return this.workersService.findAll(user);
  }

  @Query(() => Worker, { name: 'worker' })
  @UseGuards(JwtAuthGuard)
  findOne(
    @Args('id', { type: () => String }, ParseUUIDPipe) id: string,
    @CurrentUser([
      UserRoles.Administrador,
      UserRoles.superAdmin,
      UserRoles.centroTalachero,
      UserRoles.Talachero,
    ])
    user: User,
  ) {
    return this.workersService.findOne(id);
  }

  @Mutation(() => Worker, {
    name: 'updatedWorker',
  })
  @UseGuards(JwtAuthGuard)
  updateWorker(
    @Args('updateWorkerInput') updateWorkerInput: UpdateWorkerInput,
    @CurrentUser([UserRoles.Administrador, UserRoles.superAdmin])
    user: User,
  ) {
    return this.workersService.update(
      updateWorkerInput.id,
      updateWorkerInput,
      user,
    );
  }

  @Subscription(() => Worker, {
    name: 'newWorker',
    description: 'Subscribe to new workers',
  })
  @UseGuards(NoAuthAuthGuard)
  subscribeNewWorker(): AsyncIterator<Worker> {
    return this.pubSub.asyncIterator('newWorker');
  }
}
