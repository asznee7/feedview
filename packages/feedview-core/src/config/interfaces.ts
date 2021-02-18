export interface AppConfig {
  redis: RedisConfig;
  news: NewsApiConfig;
}

export interface RedisConfig {
  host: string;
  port: number;
}

export interface NewsApiConfig {
  api_key: string;
  url: string;
}
