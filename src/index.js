import dotenv from 'dotenv';
import { Logger } from '@fvilers/simple-logger';
import { isProd } from './helpers';

const logger = new Logger();

if (!isProd()) {
  dotenv.load();
}

logger.log(process.env.ALGOLIA_APP_ID);
