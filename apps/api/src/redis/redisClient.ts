import * as dotenv from "dotenv";

import Redis from 'ioredis';

dotenv.config();

const redis = new Redis(process.env.REDIS_URL ?? "");

(async () => {
  await redis.set('check', 'Redis Works!');
  const value = await redis.get('check');
  console.log(value);
  redis.disconnect();
})();
