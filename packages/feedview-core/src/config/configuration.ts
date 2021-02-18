import { AppConfig } from './interfaces';

export default (): AppConfig => ({
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT, 10),
  },
  news: {
    api_key: process.env.NEWS_API_KEY,
    url: process.env.NEWS_API_URL,
  },
});
