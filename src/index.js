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
  for (const index of items) {
    logger.log(index.name);
  }
}

main().catch(e => logger.error(e.message));
