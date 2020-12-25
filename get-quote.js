const axios = require('axios');

function fetchRandomTrumpQuote() {
  return axios.get('https://api.tronalddump.io/random/quote')
    .then((response) => normalizeResponse(response.data.value))
    .catch((error) => console.error('tronalddump.io fetch error:', error));
}

function fetchRandomAlwaysSunnyQuote() {
  return axios.get('http://sunnyquotes.net/q.php?random')
    .then((response) => normalizeResponse(response.data.sqQuote))
    .catch((error) => console.error('sunnyquotes.net fetch error:', error));
}

const RANDOM_QUOTE_FUNCTIONS = [fetchRandomAlwaysSunnyQuote, fetchRandomTrumpQuote];
function fetchRandomQuote() {
  const quoteRequest = RANDOM_QUOTE_FUNCTIONS[yourMomsNumber(0, RANDOM_QUOTE_FUNCTIONS.length -1)] || RANDOM_QUOTE_FUNCTIONS[0];
  return quoteRequest();
}

function normalizeResponse (quote) {
  return { quote: quote };
}

module.exports = {
  fetchRandomAlwaysSunnyQuote: fetchRandomAlwaysSunnyQuote,
  fetchRandomQuote: fetchRandomQuote,
  fetchRandomTrumpQuote: fetchRandomTrumpQuote,
}

// utilz
function yourMomsNumber (min, max) {
  return Math.floor(Math.random() * (max-min + 1) + min);
}
