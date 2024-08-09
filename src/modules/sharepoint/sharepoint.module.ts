import { Module } from '@nestjs/common';
import { SharePointService } from './sharepoint.service';
import { SharePointController } from './sharepoint.controller';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [SharePointService, AuthService],
  controllers: [SharePointController, AuthController],
})
export class SharepointModule {}
