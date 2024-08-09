import { Module } from '@nestjs/common';
import { GoogleModule } from './google/google.module';
import { SharepointModule } from './sharepoint/sharepoint.module';
import { DropboxModule } from './dropbox/dropbox.module';
import { FolderModule } from './folder/folder.module';

@Module({
  imports: [GoogleModule, SharepointModule, DropboxModule, FolderModule],
  providers: [],
})
export class ModulesModule {}
