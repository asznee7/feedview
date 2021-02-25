import { TweetEntity } from '../types';

export const colorMap = {
  Neutral: '#656565',
  Positive: '#57ad57',
  Negative: '#f44336',
};

export function getSentiment(score: number) {
  if (score === 0) return 'Neutral';
  return score > 0 ? 'Positive' : 'Negative';
}

export function getTotalSentiment(array: { sentiment: { score: number } }[]) {
  return getSentiment(
    array.reduce((acc: number, e) => acc + e.sentiment?.score || 0, 0),
  );
}

export function getAverageSentiment(array: { sentiment: { score: number } }[]) {
  return array.reduce((acc: number, e) => acc + e.sentiment?.score || 0, 0);
}

export function getAverageEngagement(tweets: TweetEntity[]) {
  const totalEngagement = tweets.reduce(
    (acc: number, e: TweetEntity) => acc + e.engagement,
    0,
  );

  return totalEngagement / tweets.length;
}
