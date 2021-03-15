import React from 'react';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Card } from '@material-ui/core';
import { TweetEntity } from '../../types';

const defaultOptions: Highcharts.Options = {
  title: {
    text: 'Twitter: Engagement and Sentiment',
  },
};

const EngagementChart = (
  props: HighchartsReact.Props & {
    tweets: TweetEntity[];
  },
) => {
  const { tweets } = props;
  const tweetSeriesDataRaw = tweets.map((a) => a.engagement);
  const tweetSeriesDataRatio = Math.max(...tweetSeriesDataRaw) / 100;
  const tweetSeriesData = tweetSeriesDataRaw.map((v) =>
    Math.round(v / tweetSeriesDataRatio),
  );

  const tweetSeriesSentimentRaw = tweets.map((a) => a.sentiment.score);
  const tweetSeriesSentimentRatio = Math.max(...tweetSeriesSentimentRaw) / 100;
  const tweetSeriesSentiment = tweetSeriesSentimentRaw.map((v) =>
    Math.round(v / tweetSeriesSentimentRatio),
  );

  const options: Highcharts.Options = {
    ...defaultOptions,
    series: [
      {
        type: 'column',
        data: tweetSeriesData,
        name: 'Engagement ',
      },
      { type: 'column', data: tweetSeriesSentiment, name: 'Sentiment' },
    ],
  };

  return (
    <Card>
      <HighchartsReact highcharts={Highcharts} options={options} {...props} />
    </Card>
  );
};
export default EngagementChart;
