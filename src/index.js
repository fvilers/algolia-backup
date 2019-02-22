import dotenv from 'dotenv';
import { Logger } from '@fvilers/simple-logger';
import algoliasearch from 'algoliasearch';
import path from 'path';
import { mkdir, writeFile } from 'fs';
import { promisify } from 'util';

import { isProd } from './helpers';

if (!isProd()) {
  dotenv.load();
}

const logger = new Logger();
const writeFileAsync = promisify(writeFile);
const mkdirAsync = promisify(mkdir);
const getIndexRecordsAsync = promisify(getIndexRecords);

async function main() {
  // Initialization
  const algoliaClient = algoliasearch(
    process.env.ALGOLIA_APP_ID,
    process.env.ALGOLIA_ADMIN_KEY
  );
  logger.log('Aloglia client initialized.');

  // Ensure output path exists
  await mkdirAsync(process.env.OUTPUT_PATH, { recursive: true });

  // List indices
  const { items } = await algoliaClient.listIndexes();
  for (const item of items) {
    const index = algoliaClient.initIndex(item.name);
    const fileName = `${index.indexName}.json`;
    const filePath = path.join(process.env.OUTPUT_PATH, fileName);
    const records = await getIndexRecordsAsync(index);

    // Write index content as JSON to file
    await writeFileAsync(filePath, JSON.stringify(records, null, 2), 'utf-8');
    logger.log('Wrote index content to', fileName);
  }
}

function getIndexRecords(index, callback) {
  const browser = index.browseAll();
  let records = [];

  browser.on('result', content => (records = records.concat(content.hits)));
  browser.on('end', () => callback(null, records));
  browser.on('error', e => callback(e));
}

main().catch(e => logger.error(e.message));
