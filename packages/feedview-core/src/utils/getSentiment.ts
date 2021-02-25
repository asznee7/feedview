import * as Sentiment from 'sentiment';
const sentiment = new Sentiment();

function getSentiment(text) {
  return sentiment.analyze(text);
}

export default getSentiment;
