import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class SharePointService {
  private siteUrl = process.env.SHAREPOINT_SITE_URL;

  constructor() {}

  async getAccessToken(): Promise<string> {
    // Replace this with the actual code to get the access token
    // This should be from your AuthService, demonstrating how to get the token
    // For now, we assume the access token is passed here directly for simplicity
    // Ideally, the AuthService should be used to manage token fetching and refreshing
    return 'YOUR_ACCESS_TOKEN';
  }

  async getFiles(): Promise<any> {
    const accessToken = await this.getAccessToken();
    const endpoint = `${this.siteUrl}/_api/web/lists/getbytitle('Shared Documents')/items`;

    try {
      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json;odata=verbose',
        },
      });

      return response.data.d.results;
    } catch (error) {
      throw new HttpException(
        `Error fetching files from SharePoint: ${error.response.data.error.message}`,
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async uploadFile(fileName: string, fileContent: Buffer): Promise<any> {
    const accessToken = await this.getAccessToken();
    const uploadUrl = `${this.siteUrl}/_api/web/getfolderbyserverrelativeurl('/Shared Documents')/files/add(overwrite=true, url='${fileName}')`;

    try {
      const response = await axios.post(uploadUrl, fileContent, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/octet-stream',
        },
      });

      return response.data.d;
    } catch (error) {
      throw new HttpException(
        `Error uploading file to SharePoint: ${error.response.data.error.message}`,
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
