import {
  Controller,
  Get,
  Post,
  Query,
  Redirect,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { DropboxService } from './dropbox.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('dropbox')
export class DropboxController {
  constructor(private dropboxService: DropboxService) {}

  @Get('auth')
  @Redirect()
  authenticate() {
    const clientId = process.env.DROPBOX_CLIENT_ID;
    const redirectUri = process.env.DROPBOX_REDIRECT_URI;
    const dropboxAuthUrl = `https://www.dropbox.com/oauth2/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}`;
    return { url: dropboxAuthUrl };
  }

  @Get('auth/callback')
  async handleDropboxCallback(@Query('code') code: string) {
    if (code) {
      await this.dropboxService.authenticate(code);
      return { message: 'Authenticated successfully' };
    }
    return { message: 'Authorization code not found' };
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: any) {
    return this.dropboxService.uploadFile(file);
  }

  @Get('list')
  async listAllFilesAndFolders(@Query('path') path: string) {
    return this.dropboxService.listAllFilesAndFolders(path);
  }

  @Get('download')
  async downloadFolder(
    // @Param('folderPath') folderPath: string,
    @Query('outputDir') outputDir: string,
  ) {
    await this.dropboxService.downloadFolder('', outputDir);
    return { message: 'Download completed' };
  }
}
