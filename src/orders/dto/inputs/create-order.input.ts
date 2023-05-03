import { InputType, Field } from '@nestjs/graphql';
import { IsIn, IsString } from 'class-validator';
import { User } from 'src/users/entities/user.entity';

@InputType()
export class CreateOrderInput {
  @IsIn(['espera', 'completado'])
  @Field(() => String)
  status: string
}
