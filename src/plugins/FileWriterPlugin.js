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
  constructor(dataFormatter, options) {
    if (!dataFormatter) throw new Error('Missing data formatter');
    this.dataFormatter = dataFormatter;
    this.options = { ...defaults, ...options };
  }

  async writeIndex(name, records) {
    const fileName = `${name}.json`;
    const filePath = pathJoin(this.options.outputPath, fileName);

    await mkdirAsync(this.options.outputPath, { recursive: true });
    await writeFileAsync(
      filePath,
      this.dataFormatter.formatData(records),
      this.options.encoding
    );
  }
}
