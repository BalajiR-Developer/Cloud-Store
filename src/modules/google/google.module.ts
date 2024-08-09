import { Module } from '@nestjs/common';
import { GoogleController } from './google.controller';
import { GoogleAuthService } from './google-auth.service';
import { GoogleDriveService } from './google-drive.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [GoogleController],
  providers: [GoogleAuthService, GoogleDriveService],
})
export class GoogleModule {}
