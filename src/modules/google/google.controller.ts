import {
  Controller,
  Get,
  Query,
  Redirect,
  Res,
  Post,
  UploadedFile,
  UseInterceptors,
  Param,
} from '@nestjs/common';
import { GoogleAuthService } from './google-auth.service';
import { GoogleDriveService } from './google-drive.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { createWriteStream } from 'fs';
import { join } from 'path';
import * as fs from 'fs';

@Controller('google')
export class GoogleController {
  constructor(
    private readonly googleAuthService: GoogleAuthService,
    private readonly googleDriveService: GoogleDriveService,
  ) {}

  @Get('auth')
  @Redirect()
  auth() {
    const url = this.googleAuthService.generateAuthUrl();
    return { url };
  }

  @Get('auth/callback')
  async authCallback(@Query('code') code: string, @Res() res) {
    const tokens = await this.googleAuthService.getTokens(code);
    // Save the refresh token securely
    console.log('Access Token:', tokens.access_token);
    console.log('Refresh Token:', tokens.refresh_token);
    res.send('Authentication successful! You can close this tab.');
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: any) {
    const { originalname, buffer, mimetype } = file;
    const result = await this.googleDriveService.uploadFile(
      originalname,
      buffer,
      mimetype,
    );
    return result;
  }

  @Get('download/:fileId')
  async downloadFile(@Param('fileId') fileId: string, @Res() res: Response) {
    const stream = await this.googleDriveService.downloadFile(fileId);

    const filePath = join(process.cwd(), `src/downloads/${fileId}`);
    const writeStream = createWriteStream(filePath);

    stream.pipe(writeStream);
    stream.on('end', () => {
      res.download(filePath);
    });
  }

  @Get('files')
  async listFiles(@Res() res: Response | any) {
    const files = await this.googleDriveService.listFiles('', res);
    return files;
  }

  @Get('download-folder/:folderId')
  async downloadFolder(
    @Param('folderId') folderId: string,
    @Res() res: Response,
  ) {
    const folderPath = join(process.cwd(), `src/downloads/${folderId}`);
    console.log(folderPath);

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    const files = await this.googleDriveService.listFilesInFolder(folderId);

    for (const file of files) {
      if (file.mimeType !== 'application/vnd.google-apps.folder') {
        const filePath = join(folderPath, file.name);
        const dest = fs.createWriteStream(filePath);

        const fileStream = await this.googleDriveService.downloadFile(file.id);
        fileStream.pipe(dest);

        await new Promise((resolve, reject) => {
          dest.on('finish', resolve);
          dest.on('error', reject);
        });
      } else {
        const subFolderPath = join(folderPath, file.name);
        if (!fs.existsSync(subFolderPath)) {
          fs.mkdirSync(subFolderPath, { recursive: true });
        }
      }
    }

    // Respond with a message or any other way you prefer
    res.send('Folder downloaded successfully');
  }
}
