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
// Service
import { ScoresService } from './scores.service';
// Auth (Decorators/Guards)
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtAuthGuard, NoAuthAuthGuard } from 'src/auth/guards';
// Entity/Dto's(Inputs)
import { CreateScoreInput, UpdateScoreInput } from './dto';
import { Score } from './entities/score.entity';
import { User } from 'src/users/entities/user.entity';
import { PubSub } from 'graphql-subscriptions';

@Resolver(() => Score)
export class ScoresResolver {
  constructor(
    @Inject('PUB_SUB') private readonly pubSub: PubSub,
    private readonly scoresService: ScoresService,
  ) {}

  @Mutation(() => Score, {
    name: 'createScore',
    description: 'Create a new rating',
  })
  @UseGuards(JwtAuthGuard)
  createScore(
    @Args('createScoreInput') createScoreInput: CreateScoreInput,
    @CurrentUser() user: User,
  ): Promise<Score> {
    const createScore = this.scoresService.create(createScoreInput, user);
    this.pubSub.publish('newScore', { newScore: createScore });
    return createScore;
  }

  @Query(() => [Score], {
    name: 'scores',
    description: 'Find all ratings',
  })
  @UseGuards(JwtAuthGuard)
  findAll(@CurrentUser() user: User): Promise<Score[]> {
    return this.scoresService.findAll();
  }

  @Query(() => Score, {
    name: 'score',
    description: 'Search for a rating by a unique ID',
  })
  @UseGuards(JwtAuthGuard)
  findOne(
    @Args('id', { type: () => String }, ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ): Promise<Score> {
    return this.scoresService.findOne(id);
  }

  @Mutation(() => Score, {
    name: 'updateScore',
    description: 'Update a rating with a unique ID',
  })
  @UseGuards(JwtAuthGuard)
  updateScore(
    @Args('updateScoreInput') updateScoreInput: UpdateScoreInput,
    @CurrentUser() user: User,
  ): Promise<Score> {
    return this.scoresService.update(
      updateScoreInput.id,
      updateScoreInput,
      user,
    );
  }

  @Mutation(() => Score, {
    name: 'removeScore',
    description: 'Remove a rating with a unique ID',
  })
  @UseGuards(JwtAuthGuard)
  removeScore(
    @Args('id', { type: () => String }, ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ): Promise<Score> {
    return this.scoresService.remove(id);
  }

  @Subscription(() => Score, {
    name: 'newScore',
    description: 'Subscribe to new scores',
  })
  @UseGuards(NoAuthAuthGuard)
  subscribeNewScore(): AsyncIterator<Score> {
    return this.pubSub.asyncIterator('newScore');
  }
}
