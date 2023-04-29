import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ScoresService } from './scores.service';
import { Score } from './entities/score.entity';
import { CreateScoreInput } from './dto/inputs/create-score.input';
import { UpdateScoreInput } from './dto/inputs/update-score.input';

@Resolver(() => Score)
export class ScoresResolver {
  constructor(private readonly scoresService: ScoresService) {}

  @Mutation(() => Score)
  createScore(@Args('createScoreInput') createScoreInput: CreateScoreInput) {
    return this.scoresService.create(createScoreInput);
  }

  @Query(() => [Score], { name: 'scores' })
  findAll() {
    return this.scoresService.findAll();
  }

  @Query(() => Score, { name: 'score' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.scoresService.findOne(id);
  }

  @Mutation(() => Score)
  updateScore(@Args('updateScoreInput') updateScoreInput: UpdateScoreInput) {
    return this.scoresService.update(updateScoreInput.id, updateScoreInput);
  }

  @Mutation(() => Score)
  removeScore(@Args('id', { type: () => Int }) id: number) {
    return this.scoresService.remove(id);
  }
}
