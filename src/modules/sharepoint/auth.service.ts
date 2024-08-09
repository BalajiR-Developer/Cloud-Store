import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as qs from 'qs';

@Injectable()
export class AuthService {
  private tenantId = process.env.AZURE_TENANT_ID;
  private clientId = process.env.AZURE_CLIENT_ID;
  private clientSecret = process.env.AZURE_CLIENT_SECRET;
  private redirectUri = process.env.AZURE_REDIRECT_URI;

  getAuthCodeUrl(): string {
    const authCodeUrlParameters = {
      client_id: this.clientId,
      response_type: 'code',
      redirect_uri: this.redirectUri,
      response_mode: 'query',
      scope: 'Files.Read Files.ReadWrite offline_access',
      state: '12345',
    };

    const queryString = qs.stringify(authCodeUrlParameters);
    return `https://login.microsoftonline.com/${this.tenantId}/oauth2/v2.0/authorize?${queryString}`;
  }

  async getAccessToken(authCode: string): Promise<string> {
    const tokenRequestParameters = {
      grant_type: 'authorization_code',
      client_id: this.clientId,
      client_secret: this.clientSecret,
      code: authCode,
      redirect_uri: this.redirectUri,
      scope: 'Files.Read Files.ReadWrite offline_access',
    };

    const response = await axios.post(
      `https://login.microsoftonline.com/${this.tenantId}/oauth2/v2.0/token`,
      qs.stringify(tokenRequestParameters),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    return response.data.access_token;
  }
}
