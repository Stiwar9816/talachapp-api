import { Controller, Get, Param, Redirect, Res } from '@nestjs/common';
import { ImagesService } from './images.service';
import { join } from 'path';
import { Response } from 'express';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  // @Get(':filename')
  // serveImage(@Param('filename') filename: string, @Res() res: Response) {
  //   // Utiliza express.static para servir las imágenes
  //   return res.sendFile(filename, { root: join(process.cwd(), 'uploads') });
  // }
  @Get(':filename')
  async serveImage(@Param('filename') filename: string, @Res() res: Response) {
    try {
      // Obtener la URL de la imagen desde el servicio
      const imageUrl = await this.imagesService.getImageUrl(filename);

      // Redirigir al usuario a la URL de la imagen
      return res.redirect(imageUrl);
    } catch (error) {
      // Manejar el error si la imagen no se puede obtener
      return res.status(404).json({ message: 'Image not found' });
    }
  }
}
