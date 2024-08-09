import { Injectable } from '@nestjs/common';
import { google, drive_v3 } from 'googleapis';
import { ConfigService } from '@nestjs/config';
import { GoogleAuthService } from './google-auth.service';
import * as stream from 'stream';
import { join } from 'path';
import { createWriteStream } from 'fs';

@Injectable()
export class GoogleDriveService {
  private drive: drive_v3.Drive;

  constructor(
    private configService: ConfigService,
    private googleAuthService: GoogleAuthService,
  ) {
    const oauth2Client = this.googleAuthService.getOAuthClient();
    oauth2Client.setCredentials({
      refresh_token: this.configService.get<string>('GOOGLE_REFRESH_TOKEN'),
    });

    this.drive = google.drive({ version: 'v3', auth: oauth2Client });
  }

  async uploadFile(fileName: string, fileBuffer: Buffer, mimeType: string) {
    const bufferStream = new stream.PassThrough();
    bufferStream.end(fileBuffer);
    const response = await this.drive.files.create({
      requestBody: {
        name: fileName,
        mimeType: mimeType,
      },
      media: {
        mimeType: mimeType,
        body: bufferStream,
      },
    });
    console.log(response);

    return response.data;
  }

  async downloadFile(fileId: string) {
    const response = await this.drive.files.get(
      { fileId, alt: 'media' },
      { responseType: 'stream' },
    );
    return response.data;
  }

  async listFiles(query?: any, res?: any) {
    const response: any = await this.drive.files.list({
      q: query,
      pageSize: 100,
      fields: 'nextPageToken, files(id, name, mimeType)',
    });

    if (response.data.files.length) {
      response.data.files.forEach(async (file) => {
        const getFile = await this.drive.files.get(
          { fileId: file.id, alt: 'media' },
          { responseType: 'stream' },
        );

        const filePath = join(process.cwd(), `src/downloads/${file.name}`);
        const writeStream = createWriteStream(filePath);

        getFile.data.pipe(writeStream);
        getFile.data.on('end', () => {
          res.download(filePath);
        });
      });
    }

    return response.data.files;
  }

  async listFilesInFolder(folderId: string) {
    const query = `'${folderId}' in parents and trashed = false`;
    const response = await this.drive.files.list({
      q: query,
      pageSize: 100,
      fields: 'nextPageToken, files(id, name, mimeType, parents)',
    });

    const files = response.data.files || [];

    for (const file of files) {
      if (file.mimeType === 'application/vnd.google-apps.folder') {
        const subFolderFiles = await this.listFilesInFolder(file.id);
        files.push(...subFolderFiles);
      }
    }

    return files;
  }
}
