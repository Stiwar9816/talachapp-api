import { Injectable } from '@nestjs/common';
import { CreateScoreInput } from './dto/inputs/create-score.input';
import { UpdateScoreInput } from './dto/inputs/update-score.input';

@Injectable()
export class ScoresService {
  create(createScoreInput: CreateScoreInput) {
    return 'This action adds a new score';
  }

  findAll() {
    return `This action returns all scores`;
  }

  findOne(id: number) {
    return `This action returns a #${id} score`;
  }

  update(id: number, updateScoreInput: UpdateScoreInput) {
    return `This action updates a #${id} score`;
  }

  remove(id: number) {
    return `This action removes a #${id} score`;
  }
}
