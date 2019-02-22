import dotenv from 'dotenv';
import { Logger } from '@fvilers/simple-logger';
import algoliasearch from 'algoliasearch';
import { isProd } from './helpers';

if (!isProd()) {
  dotenv.load();
}

const logger = new Logger();
const algoliaClient = algoliasearch(
  process.env.ALGOLIA_APP_ID,
  process.env.ALGOLIA_ADMIN_KEY
);
logger.log('Aloglia client initialized.');
