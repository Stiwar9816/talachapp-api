import { IsUUID } from 'class-validator';
import { InputType, Field, PartialType } from '@nestjs/graphql';
import { CreateScoreInput } from './create-score.input';

@InputType({
  description: `
  Diagram of the fields enabled to be able to be modified by the admin,
  talachero or user by default for a specific qualification
  `,
})
export class UpdateScoreInput extends PartialType(CreateScoreInput) {
  @IsUUID()
  @Field(() => String, {
    description: 'Id automatically generated in integer format eg: 1,2,3..',
  })
  id: string;
}
