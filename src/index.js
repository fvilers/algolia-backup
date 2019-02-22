import dotenv from 'dotenv';
import { isProd } from './helpers';

if (!isProd()) {
  dotenv.load();
}

console.log(process.env.ALGOLIA_APP_ID);
