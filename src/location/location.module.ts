import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationResolver } from './location.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from './entities/location.entity';

@Module({
  providers: [LocationResolver, LocationService],
  imports: [TypeOrmModule.forFeature([Location])],
  exports: [LocationService, TypeOrmModule]

})
export class LocationModule { }
