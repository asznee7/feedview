import React from "react";
import "./App.css";
import {
  Typography,
  Box,
  ThemeProvider,
  CssBaseline,
  createMuiTheme,
  Grid,
} from "@material-ui/core";
import useStore from "./core/useStore";
import Card from "./components/NewsCard";
import { compareDesc } from "date-fns";
import TweetCard from "./components/TweetCard";
// import GlobalStats from "./components/GlobalStats";
import Header from "./components/Header";
import Flickity from "react-flickity-component";
import { Twitter } from "@material-ui/icons";
import DateRangeOutlinedIcon from "@material-ui/icons/DateRangeOutlined";
import BeachAccessIcon from "@material-ui/icons/BeachAccess";
import { BsNewspaper } from "react-icons/bs";

import "flickity/css/flickity.css";

const theme = createMuiTheme({});

function App() {
  const { news, tweets } = useStore((store) => store);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="app">
        <Header />
        <div className="gridWrapper container">
          <Box className="gridTitle" mb={4}>
            <Typography variant="h5">Global stats</Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs>
              <div className="infoCard">
                <div className="infoCard-header">
                  <div className="infoCard-logo newsArticles">
                    <BsNewspaper size="2em" />
                  </div>
                  <h3 className="infoCard-name">News articles</h3>
                </div>
                <div className="infoCard-content">
                  <p>Articles found</p>
                  <p>Sentiment</p>
                  <div className="infoCard-footer">
                    <DateRangeOutlinedIcon />
                    Last update
                  </div>
                </div>
              </div>
            </Grid>
            <Grid item xs>
              <div className="infoCard">
                <div className="infoCard-header">
                  <div className="infoCard-logo twitter">
                    <Twitter fontSize="large" />
                  </div>
                  <h3 className="infoCard-name">Twitter</h3>
                </div>
                <div className="infoCard-content">
                  <p>Posts found</p>
                  <p>Sentiment</p>
                  <p>Engagement</p>
                  <div className="infoCard-footer">
                    <DateRangeOutlinedIcon />
                    Last update
                  </div>
                </div>
              </div>
            </Grid>
            <Grid item xs>
              <div className="infoCard">
                <div className="infoCard-header">
                  <div className="infoCard-logo total">
                    <BeachAccessIcon fontSize="large" />
                  </div>
                  <h3 className="infoCard-name">Total</h3>
                </div>
                <div className="infoCard-content">
                  <p>Sentiment</p>
                  <div className="infoCard-footer">
                    <DateRangeOutlinedIcon />
                    Last update
                  </div>
                </div>
              </div>
            </Grid>
          </Grid>
        </div>

        <div className="main">
          <div className="content container">
            <div className="info-post">
              <div className="newsContainer">
                <Box mb={2} display="block">
                  <Typography variant="h5">News articles</Typography>
                </Box>
                <div className="postContainer">
                  <Flickity
                    options={{
                      wrapAround: true,
                      autoPlay: 2000,
                      cellAlign: "left",
                    }} // takes flickity options {}
                    disableImagesLoaded={false} // default false
                  >
                    {news
                      .sort((a, b) =>
                        compareDesc(
                          new Date(a.publishedAt),
                          new Date(b.publishedAt)
                        )
                      )
                      .slice(0, 5)
                      .map((item) => (
                        <div className="flickity-slide">
                          <Card newsItem={item} key={item.url} />
                        </div>
                      ))}
                  </Flickity>
                </div>
              </div>
              <div className="tweetContainer">
                <Box mb={2}>
                  <Typography variant="h5">Twitter</Typography>
                </Box>
                <div className="newsContainer">
                  <Flickity
                    options={{
                      wrapAround: true,
                      autoPlay: 3000,
                      cellAlign: "left",
                    }} // takes flickity options {}
                    disableImagesLoaded={false} // default false
                  >
                    {tweets
                      .sort((a, b) =>
                        compareDesc(
                          new Date(a.created_at),
                          new Date(b.created_at)
                        )
                      )
                      .slice(0, 10)
                      .map((item) => (
                        <TweetCard tweet={item} key={item.id} />
                      ))}
                  </Flickity>
                </div>
              </div>
            </div>
            {/* <div className="globalStatsContainer">
              <Box mb={2}>
                <Typography variant="h5">Global stats</Typography>
              </Box>
              <GlobalStats articles={news} tweets={tweets} />
            </div> */}
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
