import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SharePointService } from './sharepoint.service';
import { Response } from 'express';

@Controller('sharepoint')
export class SharePointController {
  constructor(private readonly sharePointService: SharePointService) {}

  @Get('files')
  async getFiles(@Res() res: Response) {
    try {
      const files = await this.sharePointService.getFiles();
      res.json(files);
    } catch (error) {
      res.status(HttpStatus.UNAUTHORIZED).send(`Error: ${error.message}`);
    }
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: any, @Res() res: Response) {
    try {
      const result = await this.sharePointService.uploadFile(
        file.originalname,
        file.buffer,
      );
      res.json(result);
    } catch (error) {
      res.status(HttpStatus.UNAUTHORIZED).send(`Error: ${error.message}`);
    }
  }
}
