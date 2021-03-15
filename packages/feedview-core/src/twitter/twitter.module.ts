import { HttpModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TwitterApiConfig } from 'src/config/interfaces';
import { TwitterService } from './twitter.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const twitterConfig = configService.get<TwitterApiConfig>('twitter');

        return {
          baseURL: twitterConfig.url,
          headers: {
            Authorization: `Bearer ${twitterConfig.bearer_token}`,
          },
          params: {
            'user.fields': 'name,username',
            expansions: 'author_id',
            max_results: 100,
            'tweet.fields': 'created_at,public_metrics',
            'media.fields': 'preview_image_url,url',
          },
        };
      },
    }),
  ],
  providers: [TwitterService],
  exports: [TwitterService],
})
export class TwitterModule {}
