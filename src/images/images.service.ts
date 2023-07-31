import { Injectable } from '@nestjs/common';
import { s3Client } from 'src/prices/utils/s3Client';

@Injectable()
export class ImagesService {
  async getImageUrl(filename: string) {
    try {
      const getParams = {
        Bucket: process.env.BUCKET_NAME,
        Key: filename,
      };
      // Obtén la URL firmada de la imagen (expirará después de un tiempo)
      const command = s3Client.getSignedUrl('getObject', getParams);
      return command;
    } catch (error) {
      // Manejar el error apropiadamente si la imagen no se puede obtener
      throw new Error('Image not found');
    }
  }
}
