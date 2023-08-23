import { Module } from '@nestjs/common';
import { ScoresService } from './scores.service';
import { ScoresResolver } from './scores.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Score } from './entities/score.entity';
import { PubSub } from 'graphql-subscriptions';

@Module({
  providers: [ScoresResolver, ScoresService, {
    provide: 'PUB_SUB',
    useValue: new PubSub(),
  }],
  imports: [TypeOrmModule.forFeature([Score])],
})
export class ScoresModule { }
