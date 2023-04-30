import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ScoresService } from './scores.service';
import { Score } from './entities/score.entity';
import { CreateScoreInput } from './dto/inputs/create-score.input';
import { UpdateScoreInput } from './dto/inputs/update-score.input';
import { ParseIntPipe } from '@nestjs/common';

@Resolver(() => Score)
export class ScoresResolver {
  constructor(private readonly scoresService: ScoresService) { }

  @Mutation(() => Score)
  createScore(@Args('createScoreInput') createScoreInput: CreateScoreInput): Promise<Score> {
    return this.scoresService.create(createScoreInput);
  }

  @Query(() => [Score], { name: 'scores' })
  findAll(): Promise<Score[]> {
    return this.scoresService.findAll();
  }

  @Query(() => Score, { name: 'score' })
  findOne(@Args('id', { type: () => Int }, ParseIntPipe) id: number): Promise<Score> {
    return this.scoresService.findOne(id);
  }

  @Mutation(() => Score, { name: 'updateScore' })
  updateScore(@Args('updateScoreInput') updateScoreInput: UpdateScoreInput): Promise<Score> {
    return this.scoresService.update(updateScoreInput.id, updateScoreInput);
  }

  @Mutation(() => Score, { name: 'removeScore' })
  removeScore(@Args('id', { type: () => Int }, ParseIntPipe) id: number): Promise<Score> {
    return this.scoresService.remove(id);
  }
}
