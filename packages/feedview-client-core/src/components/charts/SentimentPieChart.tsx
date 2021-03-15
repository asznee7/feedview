import React from 'react';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Card } from '@material-ui/core';
import { NewsEntity, TweetEntity } from '../../types';

const defaultOptions: Highcharts.Options = {
  title: {
    text: 'Sentiment proportion',
  },
};

const SentimentPieChart = (
  props: HighchartsReact.Props & {
    articles: NewsEntity[];
    tweets: TweetEntity[];
  },
) => {
  const { articles, tweets } = props;
  const originalData = [
    ...articles.map((a) => a.sentiment.score),
    ...tweets.map((a) => a.sentiment.score),
  ];

  const options: Highcharts.Options = {
    ...defaultOptions,
    series: [
      {
        type: 'pie',
        data: [
          {
            name: 'Positive',
            color: 'rgba(89, 152, 26, 0.85)',
            y: originalData.filter((value) => value > 0).length,
          },
          {
            name: 'Negative',
            color: 'rgba(223, 83, 83, 0.85)',
            y: originalData.filter((value) => value < 0).length,
          },
          {
            name: 'Neutral',
            color: 'rgba(228, 229, 232, 0.85)',
            y: originalData.filter((value) => value === 0).length,
          },
        ],
      },
    ],
  };

  return (
    <Card>
      <HighchartsReact highcharts={Highcharts} options={options} {...props} />
    </Card>
  );
};
export default SentimentPieChart;
