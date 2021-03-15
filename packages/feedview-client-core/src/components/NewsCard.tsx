import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import SentimentSatisfiedIcon from '@material-ui/icons/SentimentSatisfied';
import { NewsEntity } from '../types';
import { colorMap, getSentiment } from '../utils/getSentiment';
import LastUpdated from './LastUpdated';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
    minWidth: 345,
    margin: '0 1em 1em 0',
  },
  media: {
    height: 0,
    paddingTop: '56.25%',
  },
  avatar: {
    backgroundColor: red[500],
  },
  title: {
    paddingBottom: '16px',
  },
  footer: {
    padding: '0 16px 16px',
  },
}));

interface NewsCardProps {
  newsItem: NewsEntity;
}

export default function NewsCard({ newsItem }: NewsCardProps) {
  const classes = useStyles();

  const sentiment = getSentiment(newsItem.sentiment?.score);
  const sentmentColor = colorMap[sentiment];

  return (
    <Card className={classes.root}>
      <CardHeader
        title={`${newsItem.source?.name || ''} - ${newsItem.author || ''}`}
        titleTypographyProps={{ variant: 'body2' }}
        subheader={<LastUpdated lastUpdated={newsItem.publishedAt} />}
        subheaderTypographyProps={{ variant: 'body2' }}
        onClick={() => window.open(newsItem.url, '_blank')}
        style={{ cursor: 'pointer' }}
      />
      {newsItem.urlToImage && (
        <CardMedia className={classes.media} image={newsItem.urlToImage} />
      )}
      <CardContent>
        <Typography
          variant='h5'
          color='textPrimary'
          component='p'
          className={classes.title}
        >
          {newsItem.title}
        </Typography>
        <Typography variant='body2' color='textSecondary' component='p'>
          {newsItem.description}
        </Typography>
      </CardContent>
      <CardActions className={classes.footer}>
        <SentimentSatisfiedIcon htmlColor={sentmentColor} />
        <Typography
          color='textPrimary'
          variant='body2'
          style={{ color: sentmentColor }}
        >
          {`${sentiment} (${newsItem.sentiment?.score})`}
        </Typography>
      </CardActions>
    </Card>
  );
}
