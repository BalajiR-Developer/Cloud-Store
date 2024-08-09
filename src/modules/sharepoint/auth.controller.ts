import { Controller, Get, Query, Redirect, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('login')
  @Redirect()
  async login(@Req() req: any, @Res() res: any) {
    console.log(req, res);
    const authUrl = await this.authService.getAuthCodeUrl();
    console.log(authUrl);
    return { url: authUrl };
  }

  @Get('callback')
  async callback(@Query('code') authCode: string, @Res() res: Response) {
    try {
      const token = await this.authService.getAccessToken(authCode);
      res.json({ accessToken: token });
    } catch (error) {
      res.status(500).send(`Error during callback: ${error.message}`);
    }
  }
}
