import { HttpService, Injectable } from '@nestjs/common';
import { response } from 'express';
import { interval, pipe } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import * as Sentiment from 'sentiment';
const sentiment = new Sentiment();

@Injectable()
export class NewsService {
  constructor(private readonly httpService: HttpService) {}

  getSentiment(article) {
    return sentiment.analyze(article.description);
  }

  getNews(q: string) {
    const newsObs = this.httpService.get('', { params: { q } }).pipe(
      map((response) => {
        console.log('response: ', response.data.articles);
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
            sentiment: this.getSentiment(a),
          }));
        }

        return newsArticles;
      }),
    );

    return withSentiment;

    // interval(1000)
    //   .pipe(mergeMap(() => new Promise(() => 1 as any)))
    //   .subscribe((data) => console.log(data));
  }
}
