import React from 'react';
import './App.css';
import {
  Typography,
  Box,
  ThemeProvider,
  CssBaseline,
  createMuiTheme,
} from '@material-ui/core';
import useStore from './core/useStore';
import Card from './components/NewsCard';
import { compareDesc } from 'date-fns';
import TweetCard from './components/TweetCard';
import GlobalStats from './components/GlobalStats';
import Header from './components/Header';
import SentimentChart from './components/charts/SentimentChart';
import SentimentPieChart from './components/charts/SentimentPieChart';
import EngagementChart from './components/charts/EngagementChart';

const theme = createMuiTheme({});

function App() {
  const { news, tweets } = useStore((store) => store);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className='app'>
        <Header />
        <div className='main'>
          <div className='content'>
            <div></div>
            <div>
              <Box mb={2} display='block'>
                <Typography variant='h5'>News articles</Typography>
              </Box>
              <div className='newsContainer'>
                {news
                  .sort((a, b) =>
                    compareDesc(
                      new Date(a.publishedAt),
                      new Date(b.publishedAt),
                    ),
                  )
                  .slice(0, 5)
                  .map((item) => (
                    <Card newsItem={item} key={item.url} />
                  ))}
              </div>
            </div>
            <div className='tweetContainer'>
              <Box mb={2}>
                <Typography variant='h5'>Twitter</Typography>
              </Box>
              <div className='newsContainer'>
                {tweets
                  .sort((a, b) =>
                    compareDesc(new Date(a.created_at), new Date(b.created_at)),
                  )
                  .slice(0, 10)
                  .map((item) => (
                    <TweetCard tweet={item} key={item.id} />
                  ))}
              </div>
            </div>
            <div className='globalStatsContainer'>
              <Box mb={2}>
                <Typography variant='h5'>Statistics</Typography>
              </Box>
              <GlobalStats articles={news} tweets={tweets} />
              <SentimentChart articles={news} tweets={tweets} />
              <SentimentPieChart articles={news} tweets={tweets} />
              <EngagementChart tweets={tweets} />
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
