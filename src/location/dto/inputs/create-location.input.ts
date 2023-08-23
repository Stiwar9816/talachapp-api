import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType({
  description: 'Outline of information that is expected to create a new location'
})
export class CreateLocationInput {
  
  @IsString()
  @IsNotEmpty()
  @Field(()=> String)
  geohash: string

  @IsString()
  @IsNotEmpty()
  @Field(()=> String)
  geopoint: string

  @IsString()
  @IsNotEmpty()
  @Field(()=> String)
  status: string
}
