import { Module } from '@nestjs/common';
import { ScoresService } from './scores.service';
import { ScoresResolver } from './scores.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Score } from './entities/score.entity';
@Module({
  providers: [ScoresResolver, ScoresService],
  imports: [TypeOrmModule.forFeature([Score])],
})
export class ScoresModule { }
