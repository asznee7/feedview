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
import { formatDistanceToNow } from 'date-fns';
import { getSentiment } from '../utils/getSentiment';

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

interface RecipeReviewCardProps {
  newsItem: NewsEntity;
}

export default function RecipeReviewCard({ newsItem }: RecipeReviewCardProps) {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardHeader
        title={`${newsItem.source.name} - ${newsItem.author}`}
        titleTypographyProps={{ variant: 'body2' }}
        subheader={formatDistanceToNow(new Date(newsItem.publishedAt), {
          addSuffix: true,
        })}
        subheaderTypographyProps={{ variant: 'body2' }}
      />
      <CardMedia className={classes.media} image={newsItem.urlToImage} />
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
        <SentimentSatisfiedIcon />
        <Typography color='textPrimary' variant='body2'>
          {getSentiment(newsItem.sentiment.score)}
        </Typography>
      </CardActions>
    </Card>
  );
}
