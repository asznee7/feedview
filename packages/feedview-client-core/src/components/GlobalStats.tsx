import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import BeachAccessIcon from '@material-ui/icons/BeachAccess';
import { Card } from '@material-ui/core/';
import { Twitter } from '@material-ui/icons';
import { BsNewspaper } from 'react-icons/bs';
import { NewsEntity, TweetEntity } from '../types';
import {
  getAverageEngagement,
  getAverageSentiment,
  getTotalSentiment,
} from '../utils/getSentiment';
import LastUpdated from './LastUpdated';
import useStore from '../core/useStore';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    justifyContent: 'space-between',
  },
  block: {
    flexBasis: '30%',
    display: 'flex',
    flexDirection: 'column',
    padding: '1em',
  },
}));

interface GlobalStatsProps {
  articles: NewsEntity[];
  tweets: TweetEntity[];
}

function GlobalStats({ articles, tweets }: GlobalStatsProps) {
  const classes = useStyles();
  const { lastUpdatedTwitter, lastUpdatedNews } = useStore((store) => store);

  return (
    <Card>
      <Box className={classes.root}>
        <Box className={classes.block}>
          <Box>
            <Avatar>
              <BsNewspaper />
            </Avatar>
            <ListItemText primary='News articles' />
          </Box>
          <Box>
            <ListItemText
              primary={
                <LastUpdated lastUpdated={lastUpdatedNews} variant='body1' />
              }
              secondary='Last update'
            />
          </Box>
          <Box>
            <ListItemText
              primary={articles.length}
              secondary='Articles found'
            />
          </Box>
          <Box>
            <ListItemText
              primary={`${getTotalSentiment(articles)} (${getAverageSentiment(
                articles,
              )})`}
              secondary='Sentiment'
            />
          </Box>
        </Box>
        <Box className={classes.block}>
          <Box>
            <Avatar>
              <Twitter />
            </Avatar>
            <ListItemText primary='Twitter' />
          </Box>
          <Box>
            <ListItemText
              primary={
                <LastUpdated lastUpdated={lastUpdatedTwitter} variant='body1' />
              }
              secondary='Last update'
            />
          </Box>
          <Box>
            <ListItemText primary={tweets.length} secondary='Posts found' />
          </Box>
          <Box>
            <ListItemText
              primary={`${getTotalSentiment(tweets)} (${getAverageSentiment(
                tweets,
              )})`}
              secondary='Sentiment'
            />
          </Box>
          <Box>
            <ListItemText
              primary={getAverageEngagement(tweets)}
              secondary='Engagement'
            />
          </Box>
        </Box>
        <Box className={classes.block}>
          <Box>
            <Avatar>
              <BeachAccessIcon />
            </Avatar>
            <ListItemText primary='Total' />
          </Box>
          <Box>
            <ListItemText
              primary={`${getTotalSentiment([
                ...tweets,
                ...articles,
              ])} (${getAverageSentiment([...tweets, ...articles])})`}
              secondary='Sentiment'
            />
          </Box>
        </Box>
      </Box>
    </Card>
  );
}

export default GlobalStats;
