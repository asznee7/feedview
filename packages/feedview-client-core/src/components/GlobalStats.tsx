import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import BeachAccessIcon from '@material-ui/icons/BeachAccess';
import Divider from '@material-ui/core/Divider';
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
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

interface GlobalStatsProps {
  articles: NewsEntity[];
  tweets: TweetEntity[];
}

function GlobalStats({ articles, tweets }: GlobalStatsProps) {
  const classes = useStyles();
  const { lastUpdated } = useStore((store) => store);

  return (
    <Card>
      <div>
        <List className={classes.root}>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <BsNewspaper />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary='News articles' />
          </ListItem>
          <ListItem>
            <ListItemText
              primary={
                <LastUpdated lastUpdated={lastUpdated} variant='body1' />
              }
              secondary='Last update'
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary={articles.length}
              secondary='Articles found'
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary={`${getTotalSentiment(articles)} (${getAverageSentiment(
                articles,
              )})`}
              secondary='Average sentiment'
            />
          </ListItem>
          <Divider variant='inset' component='li' />
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <Twitter />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary='Twitter' />
          </ListItem>
          <ListItem>
            <ListItemText
              primary={
                <LastUpdated lastUpdated={lastUpdated} variant='body1' />
              }
              secondary='Last update'
            />
          </ListItem>
          <ListItem>
            <ListItemText primary={tweets.length} secondary='Posts found' />
          </ListItem>
          <ListItem>
            <ListItemText
              primary={`${getTotalSentiment(tweets)} (${getAverageSentiment(
                tweets,
              )})`}
              secondary='Average sentiment'
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary={getAverageEngagement(tweets)}
              secondary='Average engagement'
            />
          </ListItem>
          <Divider variant='inset' component='li' />
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <BeachAccessIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary='Total' />
          </ListItem>
          <ListItem>
            <ListItemText primary='Sentiment' secondary='Sentiment' />
          </ListItem>
        </List>
      </div>
    </Card>
  );
}

export default GlobalStats;
