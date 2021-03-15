import React from 'react';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Card } from '@material-ui/core';
import { NewsEntity, TweetEntity } from '../../types';

const defaultOptions: Highcharts.Options = {
  title: {
    text: 'Latest sentiment trend',
  },
};

const SentimentChart = (
  props: HighchartsReact.Props & {
    articles: NewsEntity[];
    tweets: TweetEntity[];
  },
) => {
  const { articles, tweets } = props;
  const newsSeriesData = articles.map((a) => a.sentiment.score);
  const tweetSeriesData = tweets.map((a) => a.sentiment.score);

  const options: Highcharts.Options = {
    ...defaultOptions,
    series: [
      {
        type: 'line',
        data: newsSeriesData,
        name: 'Articles',
        color: 'rgba(223, 83, 83, 0.85)',
      },
      {
        type: 'line',
        data: tweetSeriesData,
        name: 'Tweets',
      },
    ],
  };

  return (
    <Card>
      <HighchartsReact highcharts={Highcharts} options={options} {...props} />
    </Card>
  );
};
export default SentimentChart;
