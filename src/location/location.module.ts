import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationResolver } from './location.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from './entities/location.entity';
import { PubSub } from 'graphql-subscriptions';

@Module({
  providers: [LocationResolver, LocationService, {
    provide: 'PUB_SUB',
    useValue: new PubSub(),
  }],
  imports: [TypeOrmModule.forFeature([Location])],
  exports: [LocationService, TypeOrmModule]

})
export class LocationModule { }
