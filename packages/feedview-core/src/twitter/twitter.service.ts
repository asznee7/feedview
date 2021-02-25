import { HttpService, Injectable } from '@nestjs/common';
import { map } from 'rxjs/operators';
import getSentiment from 'src/utils/getSentiment';

@Injectable()
export class TwitterService {
  constructor(private readonly httpService: HttpService) {}

  getTweets(query: string) {
    const tweets = this.httpService.get('', { params: { query } }).pipe(
      map((response) => {
        if (response?.data?.data) {
          const dataUsers = response?.data?.includes?.users;
          const dataTweets = response?.data?.data.map((t) => {
            const newTweet = {
              ...t,
              author: dataUsers.find((u) => u.id === t.author_id),
              engagement: Object.values(t.public_metrics).reduce(
                (acc: number, el: number) => acc + el,
              ),
              likes: t.public_metrics.like_count,
            };

            return newTweet;
          });
          return dataTweets;
        }

        return response;
      }),
    );

    const withSentiment = tweets.pipe(
      map((tweets) => {
        if (Array.isArray(tweets)) {
          return tweets.map((a) => ({
            ...a,
            sentiment: getSentiment(a.text),
          }));
        }

        return tweets;
      }),
    );

    return withSentiment;
  }
}
