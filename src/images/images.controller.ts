import { Controller, Get, Param, Res } from '@nestjs/common';
import { ImagesService } from './images.service';
import { Response } from 'express';
import { join } from 'path';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get(':filename')
  serveImage(@Param('filename') filename: string, @Res() res: Response) {
    // Utiliza express.static para servir las imágenes
    return res.sendFile(filename, { root: join(process.cwd(), 'uploads') });
  }
}
