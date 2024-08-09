import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { FolderService } from './folder.service';
import * as fs from 'fs';

@Controller('folder')
export class FolderController {
  constructor(private readonly folderService: FolderService) {}

  @Get(':folderName/download')
  async downloadFolder(
    @Param('folderName') folderName: string,
    @Res() res: Response,
  ) {
    const folderPath = `src/downloads/${folderName}`;
    const buffer = await this.folderService.folderToBuffer(folderPath);

    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename=${folderName}.zip`,
      'Content-Length': buffer.length,
    });

    await fs.writeFileSync(`src/downloads/convertToZip.zip`, buffer, 'binary');
    res.send(buffer);
  }
}
