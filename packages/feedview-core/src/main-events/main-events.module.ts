import * as redisStore from 'cache-manager-redis-store';
import { CacheModule, Module } from '@nestjs/common';
import { MainEventsGateway } from './main-events.gateway';
import { ConfigService } from '@nestjs/config';
import { RedisConfig } from 'src/config/interfaces';
import { NewsModule } from 'src/news/news.module';

@Module({
  providers: [MainEventsGateway],
  imports: [
    CacheModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const redisConfig = configService.get<RedisConfig>('redis');

        return {
          store: redisStore,
          host: redisConfig.host,
          port: redisConfig.port,
        };
      },
    }),
    NewsModule,
  ],
})
export class MainEvents {}
