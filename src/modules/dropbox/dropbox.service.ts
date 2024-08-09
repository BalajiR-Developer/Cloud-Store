import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Dropbox, DropboxAuth } from 'dropbox';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class DropboxService {
  private dbxAuth: DropboxAuth;
  private dbx: Dropbox;

  constructor(private configService: ConfigService) {
    this.dbxAuth = new DropboxAuth({
      clientId: this.configService.get<string>('DROPBOX_CLIENT_ID'),
      clientSecret: this.configService.get<string>('DROPBOX_CLIENT_SECRET'),
    });
    this.dbxAuth.setAccessToken('YOUR_AUTH_TOKEN');
    this.dbx = new Dropbox({ auth: this.dbxAuth });
  }

  async authenticate(authCode: string): Promise<void> {
    try {
      const response: any = await this.dbxAuth.getAccessTokenFromCode(
        this.configService.get<string>('DROPBOX_REDIRECT_URI'),
        authCode,
      );

      const accessToken = response.result.access_token;
      if (accessToken) {
        this.dbxAuth.setAccessToken(accessToken);
        this.dbx = new Dropbox({ auth: this.dbxAuth });
      } else {
        throw new Error('Access token not found in response');
      }
    } catch (error) {
      console.error('Error authenticating with Dropbox:', error);
      throw error;
    }
  }

  async uploadFile(file: any): Promise<any> {
    try {
      if (!this.dbx) {
        throw new Error('Dropbox client is not authenticated');
      }
      const filePath = `/${file.originalname}`; // Define the path where the file will be uploaded
      const content = file.buffer; // File buffer from Multer
      return this.dbx.filesUpload({ path: filePath, contents: content });
    } catch (error) {
      console.error('Error uploading file to Dropbox:', error);
      throw error;
    }
  }

  async listAllFilesAndFolders(folderPath: string): Promise<any[]> {
    try {
      if (!this.dbx) {
        throw new Error('Dropbox client is not authenticated');
      }

      let entries: any[] = [];
      let hasMore = true;
      let cursor = null;

      while (hasMore) {
        let response;

        if (cursor) {
          response = await this.dbx.filesListFolderContinue({ cursor });
        } else {
          response = await this.dbx.filesListFolder({ path: folderPath });
        }

        entries = entries.concat(response.result.entries);
        hasMore = response.result.has_more;
        cursor = response.result.cursor;
      }

      return entries;
    } catch (error) {
      console.error('Error listing files and folders:', error);
      throw error;
    }
  }

  async downloadFile(filePath: string, outputDir: string): Promise<void> {
    try {
      console.log({ filePath, outputDir });
      console.log(fs.existsSync(outputDir));

      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      console.log(123);

      const response: any = await this.dbx.filesDownload({ path: filePath });
      console.log({ response });

      const fileBinary = response.result.fileBinary as Buffer;
      const filename = path.basename(filePath);
      console.log({ filename });

      const outputPath = path.join(outputDir, filename);

      fs.writeFileSync(outputPath, fileBinary, 'binary');
      console.log(`File downloaded: ${filename}`);
    } catch (error) {
      console.error(`Error downloading file ${filePath}:`, error);
      throw error;
    }
  }

  async downloadFolder(folderPath: string, outputDir: string): Promise<void> {
    try {
      // if (!fs.existsSync(outputDir)) {
      //   fs.mkdirSync(outputDir);
      // }

      const entries = await this.listAllFilesAndFolders(folderPath);

      for (const entry of entries) {
        const entryPath = entry.path_lower;
        const localPath = path.join(
          outputDir,
          entryPath.replace(folderPath, ''),
        );

        if (entry['.tag'] === 'file') {
          await this.downloadFile(entryPath, outputDir);
        } else if (entry['.tag'] === 'folder') {
          // if (!fs.existsSync(localPath)) {
          //   fs.mkdirSync(localPath);
          // }
          await this.downloadFolder(entryPath, localPath);
        }
      }
    } catch (error) {
      console.error(`Error downloading folder ${folderPath}:`, error);
      throw error;
    }
  }
}
