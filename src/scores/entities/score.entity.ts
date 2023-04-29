import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Score {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
