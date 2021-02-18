import { NewsEntity } from '../types';

function getSentiment(score: number) {
  if (score === 0) return 'Neutral';
  return score > 0 ? 'Positive' : 'Negative';
}

function getTotalSentiment(articles: NewsEntity[]) {
  return getSentiment(
    articles.reduce(
      (acc: number, article: NewsEntity) => acc + article.sentiment.score,
      0,
    ),
  );
}

export { getSentiment, getTotalSentiment };
