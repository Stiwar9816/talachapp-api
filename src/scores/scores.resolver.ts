import { ParseIntPipe, UseGuards } from '@nestjs/common';
// GraphQL
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
// Service
import { ScoresService } from './scores.service';
// Auth (Decorators/Guards)
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards';
// Entity/Dto's(Inputs)
import { CreateScoreInput, UpdateScoreInput } from './dto';
import { Score } from './entities/score.entity';
import { User } from 'src/users/entities/user.entity';

@Resolver(() => Score)
@UseGuards(JwtAuthGuard)
export class ScoresResolver {
  constructor(
    private readonly scoresService: ScoresService
  ) { }

  @Mutation(() => Score, {
    name: 'createScore',
    description: 'Create a new rating'
  })
  createScore(
    @Args('createScoreInput') createScoreInput: CreateScoreInput,
    @CurrentUser() user: User
  ): Promise<Score> {
    return this.scoresService.create(createScoreInput, user);
  }

  @Query(() => [Score], {
    name: 'scores',
    description: 'Find all ratings'
  })
  findAll(@CurrentUser() user: User): Promise<Score[]> {
    return this.scoresService.findAll();
  }

  @Query(() => Score, {
    name: 'score',
    description: 'Search for a rating by a unique ID'
  })
  findOne(
    @Args('id', { type: () => Int }, ParseIntPipe) id: number,
    @CurrentUser() user: User
  ): Promise<Score> {
    return this.scoresService.findOne(id);
  }

  @Mutation(() => Score, {
    name: 'updateScore',
    description: 'Update a rating with a unique ID'
  })
  updateScore(
    @Args('updateScoreInput') updateScoreInput: UpdateScoreInput,
    @CurrentUser() user: User
  ): Promise<Score> {
    return this.scoresService.update(updateScoreInput.id, updateScoreInput, user);
  }

  @Mutation(() => Score, {
    name: 'removeScore',
    description: 'Remove a rating with a unique ID'
  })
  removeScore(
    @Args('id', { type: () => Int }, ParseIntPipe) id: number,
    @CurrentUser() user: User
  ): Promise<Score> {
    return this.scoresService.remove(id);
  }
}
