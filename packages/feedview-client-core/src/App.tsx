import React, { SyntheticEvent, useEffect, useState } from 'react';
import './App.css';
import useSocket from './core/useSocket';
import { TextField, Button, Typography, Box } from '@material-ui/core';
import useStore from './core/useStore';
import Card from './components/Card';
import { compareDesc } from 'date-fns';
import { getTotalSentiment } from './utils/getSentiment';
import LastUpdated from './components/LastUpdated';

function App() {
  const { sendQuery } = useSocket();
  const { setQuery, getQuery, news } = useStore((store) => store);

  useEffect(() => {
    const query = getQuery();
    if (query) {
      setValue(query);
    }
  }, [getQuery]);

  const [value, setValue] = useState('');

  function handleSubmit(event: SyntheticEvent) {
    event.preventDefault();
    console.log('sending...');
    setQuery(value);
    sendQuery(value);
  }

  function handleClear() {
    setQuery('');
    setValue('');
  }

  return (
    <div className='app'>
      <div className='controls'>
        <form className='form' onSubmit={handleSubmit}>
          <TextField
            value={value}
            onChange={(e) => setValue(e.target?.value as string)}
          />
          <Button
            variant='contained'
            color='primary'
            disableElevation
            onClick={handleSubmit}
          >
            Search
          </Button>
          <Button
            variant='contained'
            color='primary'
            disableElevation
            onClick={handleClear}
          >
            Clear
          </Button>
        </form>

        <h2>Results:</h2>
        <div className='content'>
          <div>
            <Box mb={2} display='block'>
              <Typography variant='h5'>News articles</Typography>
            </Box>
            <div className='newsContainer'>
              {news
                .sort((a, b) =>
                  compareDesc(new Date(a.publishedAt), new Date(b.publishedAt)),
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
          </div>
          <div className='globalStatsContainer'>
            <Box mb={2}>
              <Typography variant='h5'>Global stats</Typography>
            </Box>
            <Typography>
              <LastUpdated />
              <Typography variant='body1'>
                News articles found: {news.length}
              </Typography>
              <Typography variant='body1'>
                News sentiment: {getTotalSentiment(news)}
              </Typography>
              <Typography variant='body1'>Tweets found: {0}</Typography>
              <Typography variant='body1'>
                Twitter sentiment: {'Unknown'}
              </Typography>
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
