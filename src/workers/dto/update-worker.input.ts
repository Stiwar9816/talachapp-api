import { IsIn, IsOptional, IsUUID } from 'class-validator';
import { CreateWorkerInput } from './create-worker.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateWorkerInput extends PartialType(CreateWorkerInput) {
  @IsUUID()
  @Field(() => String)
  id: string;

  @IsOptional()
  @IsIn(['Activo', 'Inactivo'])
  @Field(() => String, {
    description:
      'User status in the system [ active (true) or inactive (false) ]',
  })
  isActive?: string;
}
