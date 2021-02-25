import { HttpModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NewsApiConfig } from 'src/config/interfaces';
import { NewsService } from './news.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const newsApiConfig = configService.get<NewsApiConfig>('news');

        return {
          baseURL: newsApiConfig.url,
          params: {
            apiKey: newsApiConfig.api_key,
            language: 'en',
            pageSize: 100,
          },
        };
      },
    }),
  ],
  providers: [NewsService],
  exports: [NewsService],
})
export class NewsModule {}
