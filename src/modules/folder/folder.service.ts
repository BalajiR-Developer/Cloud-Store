import { Injectable } from '@nestjs/common';
// import * as fs from 'fs-extra';
import * as archiver from 'archiver';
import { Stream } from 'stream';

@Injectable()
export class FolderService {
  async folderToBuffer(folderPath: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      // Create a buffer stream
      const bufferStream = new Stream.PassThrough();
      const buffers = [];

      // Collect data chunks into buffers array
      bufferStream.on('data', (chunk) => buffers.push(chunk));
      bufferStream.on('end', () => resolve(Buffer.concat(buffers)));
      bufferStream.on('error', (err) => reject(err));

      // Create a zip archive
      const archive = archiver('zip', {
        zlib: { level: 9 }, // Compression level
      });

      // Pipe the archive data to the buffer stream
      archive.pipe(bufferStream);

      // Append files from the folder to the archive
      archive.directory(folderPath, false);

      // Finalize the archive
      archive.finalize();
    });
  }
}
