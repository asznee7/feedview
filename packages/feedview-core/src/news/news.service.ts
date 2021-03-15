import { HttpService, Injectable } from '@nestjs/common';
import { map } from 'rxjs/operators';
import getSentiment from 'src/utils/getSentiment';

@Injectable()
export class NewsService {
  constructor(private readonly httpService: HttpService) {}

  getNews(q: string) {
    const newsObs = this.httpService.get('', { params: { q } }).pipe(
      map((response) => {
        if (response?.data?.articles) {
          return response.data.articles;
        }

        return response;
      }),
    );

    const withSentiment = newsObs.pipe(
      map((newsArticles) => {
        console.log('newsArticles: ', newsArticles);
        if (Array.isArray(newsArticles)) {
          return newsArticles.map((a) => ({
            ...a,
            sentiment: getSentiment(a.description || ''),
          }));
        }

        return newsArticles;
      }),
    );

    return withSentiment;
  }
}
