import { Module } from '@nestjs/common';
import { ScoresService } from './scores.service';
import { ScoresResolver } from './scores.resolver';

@Module({
  providers: [ScoresResolver, ScoresService]
})
export class ScoresModule {}
