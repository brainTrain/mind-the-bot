const axios = require('axios');

function fetchRandomTrumpQuote() {
  return axios.get('https://api.tronalddump.io/random/quote')
    .then((response) => normalizeResponse(response.data.value))
    .catch((error) => console.error('tronalddump.io fetch error:', error));
}

function fetchRandomAlwaysSunnyQuote() {
  return axios.get('http://sunnyquotes.net/q.php?random')
    .then((response) => normalizeResponse(response.data.sqQuote))
    .catch((error) => console.error('tronalddump.io fetch error:', error));
}

function fetchRandomQuote() {
  const quoteRequest = yourMomsNumber(0, 10) % 2 === 0 ? fetchRandomAlwaysSunnyQuote : fetchRandomTrumpQuote;
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
