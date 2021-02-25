export interface AppConfig {
  redis: RedisConfig;
  news: NewsApiConfig;
  twitter: TwitterApiConfig;
}

export interface RedisConfig {
  host: string;
  port: number;
}

export interface NewsApiConfig {
  api_key: string;
  url: string;
}

export interface TwitterApiConfig {
  bearer_token: string;
  url: string;
}
