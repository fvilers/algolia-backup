import { join as pathJoin } from 'path';
import { mkdir, writeFile } from 'fs';
import { promisify } from 'util';

const mkdirAsync = promisify(mkdir);
const writeFileAsync = promisify(writeFile);

export const defaults = {
  encoding: 'utf-8',
  outputPath: ''
};

export class FileWriterPlugin {
  constructor(options) {
    this.options = { ...defaults, ...options };
  }

  async writeIndex(name, records) {
    const fileName = `${name}.json`;
    const filePath = pathJoin(this.options.outputPath, fileName);

    await mkdirAsync(this.options.outputPath, { recursive: true });
    await writeFileAsync(
      filePath,
      JSON.stringify(records, null, 2),
      this.options.encoding
    );
  }
}
