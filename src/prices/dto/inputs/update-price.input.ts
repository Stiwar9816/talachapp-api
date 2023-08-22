import { IsOptional, IsString, IsUUID } from 'class-validator';
import { CreatePriceInput } from './create-price.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';
import { FileUpload } from 'src/common/interfaces/fileupload.interface';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';

@InputType({
  description: `
  Diagram of the fields enabled to be able to be modified 
  by the admin or talachero for a specific price
  `,
})
export class UpdatePriceInput extends PartialType(CreatePriceInput) {
  @IsUUID()
  @Field(() => String, {
    description: 'Id automatically generated in integer format eg: 1,2,3..',
  })
  id: string;

  @IsOptional()
  @Field(() => GraphQLUpload, { nullable: true })
  file?: Promise<FileUpload>; // Campo para recibir el archivo en el resolver 

  @IsOptional()
  @Field(() => String, { nullable: true })
  image?: string; // Campo para almacenar el nombre del archivo en la base de datos
}
