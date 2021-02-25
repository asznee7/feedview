import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import SentimentSatisfiedIcon from '@material-ui/icons/SentimentSatisfied';
import { TweetEntity } from '../types';
import { colorMap, getSentiment } from '../utils/getSentiment';
import { AiOutlineComment } from 'react-icons/ai';
import { FiHeart } from 'react-icons/fi';
import { Box } from '@material-ui/core';
import LastUpdated from './LastUpdated';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
    minWidth: 345,
    margin: '0 1em 1em 0',
  },
  header: {
    paddingBottom: 0,
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
  stats: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: 'auto !important',
    opacity: '0.75',
    '& > *': {
      marginLeft: '0.5em',
    },
  },
}));

interface TweetCardProps {
  tweet: TweetEntity;
}

function TweetCard({ tweet }: TweetCardProps) {
  const classes = useStyles();

  const sentiment = getSentiment(tweet.sentiment?.score);
  const sentmentColor = colorMap[sentiment];

  return (
    <Card className={classes.root}>
      <CardHeader
        title={`@${tweet.author.username || ''} - ${tweet.author.name || ''}`}
        titleTypographyProps={{ variant: 'body2' }}
        subheader={<LastUpdated lastUpdated={tweet.created_at}/>}
        subheaderTypographyProps={{ variant: 'body2' }}
        className={classes.header}
      />
      <CardContent>
        <Typography variant='body2' color='textSecondary' component='p'>
          {tweet.text}
        </Typography>
      </CardContent>
      <CardActions className={classes.footer}>
        <SentimentSatisfiedIcon htmlColor={sentmentColor} />
        <Typography
          color='textPrimary'
          variant='body2'
          style={{ color: sentmentColor }}
        >
          {`${sentiment} (${tweet.sentiment?.score})`}
        </Typography>
        <Box className={classes.stats}>
          <AiOutlineComment />
          <Typography>{tweet.engagement}</Typography>
          <FiHeart />
          <Typography>{tweet.likes}</Typography>
        </Box>
      </CardActions>
    </Card>
  );
}

export default TweetCard;
