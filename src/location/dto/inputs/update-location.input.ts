import { IsInt, IsPositive } from 'class-validator';
import { CreateLocationInput } from './create-location.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateLocationInput extends PartialType(CreateLocationInput) {
  @IsInt()
  @IsPositive()
  @Field(() => Int)
  id: number;
}
