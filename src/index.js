import dotenv from 'dotenv';
import { Logger } from '@fvilers/simple-logger';
import algoliasearch from 'algoliasearch';
import { isProd } from './helpers';

if (!isProd()) {
  dotenv.load();
}

const logger = new Logger();

async function main() {
  // Initialization
  const algoliaClient = algoliasearch(
    process.env.ALGOLIA_APP_ID,
    process.env.ALGOLIA_ADMIN_KEY
  );
  logger.log('Aloglia client initialized.');

  // List indices
  const { items } = await algoliaClient.listIndexes();
  for (const item of items) {
    const index = algoliaClient.initIndex(item.name);
    const records = await getIndexRecords(index);

    logger.log(index.indexName, records.length, 'records');
  }
}

function getIndexRecords(index) {
  return new Promise((resolve, reject) => {
    const browser = index.browseAll();
    let records = [];

    browser.on('result', content => (records = records.concat(content.hits)));
    browser.on('end', () => resolve(records));
    browser.on('error', e => reject(e));
  });
}

main().catch(e => logger.error(e.message));
