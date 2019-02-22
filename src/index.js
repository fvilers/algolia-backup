import dotenv from 'dotenv';
import { Logger } from '@fvilers/simple-logger';
import algoliasearch from 'algoliasearch';
import { promisify } from 'util';

import { isProd } from './helpers';
import { JsonDataFormatter } from './plugins/JsonDataFormatter';
import { FileWriterPlugin } from './plugins/FileWriterPlugin';

if (!isProd()) {
  dotenv.load();
}

const logger = new Logger();
const getIndexRecordsAsync = promisify(getIndexRecords);

async function main(outputPlugin) {
  // Initialization
  const algoliaClient = algoliasearch(
    process.env.ALGOLIA_APP_ID,
    process.env.ALGOLIA_ADMIN_KEY
  );
  logger.log('Aloglia client initialized.');

  // List indices
  const { items } = await algoliaClient.listIndexes();
  for (const { name } of items) {
    const index = algoliaClient.initIndex(name);
    const records = await getIndexRecordsAsync(index);

    // Write index content as JSON to file
    await outputPlugin.writeIndex(index.indexName, records);
  }
}

function getIndexRecords(index, callback) {
  const browser = index.browseAll();
  let records = [];

  browser.on('result', content => (records = records.concat(content.hits)));
  browser.on('end', () => callback(null, records));
  browser.on('error', e => callback(e));
}

const outputPlugin = new FileWriterPlugin(new JsonDataFormatter(), {
  outputPath: process.env.OUTPUT_PATH
});

main(outputPlugin).catch(e => logger.error(e.message));
