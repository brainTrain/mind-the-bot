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

function fetchRandomSeinfeldQuote() {
  return axios.get('https://seinfeld-quotes.herokuapp.com/random')
    .then((response) => normalizeResponse(response.data.quote))
    .catch((error) => console.error('seinfeld-quotes fetch error:', error));
}

function fetchRandomNicolasCageQuote() {
  return axios.get('https://nicolas-cage-quotes.herokuapp.com/quotes')
    .then((response) => normalizeResponse(response.data[0]))
    .catch((error) => console.error('nicolas-cage-quotes fetch error:', error));
}

function fetchRandomTheBigLebowskieQuote() {
  return axios.get('http://lebowski.me/api/quotes/random')
    .then((response) => normalizeResponse(response.data.quote.lines[0].text))
    .catch((error) => console.error('lebowski.me fetch error:', error));
}

function fetchRandomCatFact() {
  return axios.get('https://catfact.ninja/fact')
    .then((response) => normalizeResponse(response.data.fact))
    .catch((error) => console.error('catfact.ninja fetch error:', error));
}

function fetchRandomDadJoke() {
  const config = {
    headers: {
      Accept: 'application/json',
    }
  };

  return axios.get('https://icanhazdadjoke.com/', config)
    .then((response) => normalizeResponse(response.data.joke))
    .catch((error) => console.error('icanhazdadjoke.com fetch error:', error));
}

function fetchRandomChuckNorrisJoke() {
  return axios.get('https://api.chucknorris.io/jokes/random')
    .then((response) => normalizeResponse(response.data.value))
    .catch((error) => console.error('api.chucknorris.io fetch error:', error));
}

// this response is kinda big and it looks like it's a static list so let's cache for good guy greg reasonz
let TYPE_FIT_QUOTE_CACHE;
function fetchRandomTypeFitQuote() {
  // if we have a cache, don't make a request
  if (TYPE_FIT_QUOTE_CACHE) {
    return new Promise((resolve) => {
      resolve(normalizeResponse(getRandomArrayItem(TYPE_FIT_QUOTE_CACHE).text));
    });
  }

  return axios.get('https://type.fit/api/quotes')
    .then((response) => {
      TYPE_FIT_QUOTE_CACHE = response.data;

      return normalizeResponse(getRandomArrayItem(response.data).text);
    })
    .catch((error) => console.error('type.fit fetch error:', error));
}

const RANDOM_FACT_FUNCTIONS = [
  fetchRandomCatFact,
];

const RANDOM_JOKE_FUNCTIONS = [
  fetchRandomChuckNorrisJoke,
  fetchRandomDadJoke,
];

const RANDOM_QUOTE_FUNCTIONS = [
  fetchRandomAlwaysSunnyQuote,
  fetchRandomNicolasCageQuote,
  fetchRandomSeinfeldQuote,
  fetchRandomTheBigLebowskieQuote,
  fetchRandomTrumpQuote,
  fetchRandomTypeFitQuote,
];

const ALL_FUNCTIONS = [
  ...RANDOM_FACT_FUNCTIONS,
  ...RANDOM_JOKE_FUNCTIONS,
  ...RANDOM_QUOTE_FUNCTIONS,
];

function fetchRandomQuote() {
  const quoteRequest = getRandomArrayItem(RANDOM_QUOTE_FUNCTIONS);
  return quoteRequest();
}

function fetchRandomJoke() {
  const quoteRequest = getRandomArrayItem(RANDOM_JOKE_FUNCTIONS);
  return quoteRequest();
}

function fetchRandomFact() {
  const quoteRequest = getRandomArrayItem(RANDOM_FACT_FUNCTIONS);
  return quoteRequest();
}

function fetchRandomResponse() {
  const quoteRequest = getRandomArrayItem(ALL_FUNCTIONS);
  return quoteRequest();
}

function normalizeResponse (quote) {
  return { quote: quote, };
}

function getRandomArrayItem(array) {
  return array[yourMomsNumber(0, array.length - 1)] || array[0];
}

module.exports = {
  fetchRandomAlwaysSunnyQuote: fetchRandomAlwaysSunnyQuote,
  fetchRandomCatFact: fetchRandomCatFact,
  fetchRandomChuckNorrisJoke: fetchRandomChuckNorrisJoke,
  fetchRandomDadJoke: fetchRandomDadJoke,
  fetchRandomFact: fetchRandomFact,
  fetchRandomJoke: fetchRandomJoke,
  fetchRandomNicolasCageQuote: fetchRandomNicolasCageQuote,
  fetchRandomQuote: fetchRandomQuote,
  fetchRandomResponse: fetchRandomResponse,
  fetchRandomSeinfeldQuote: fetchRandomSeinfeldQuote,
  fetchRandomTheBigLebowskieQuote: fetchRandomTheBigLebowskieQuote,
  fetchRandomTrumpQuote: fetchRandomTrumpQuote,
  fetchRandomTypeFitQuote: fetchRandomTypeFitQuote,
}

// utilz
function yourMomsNumber (min, max) {
  return Math.floor(Math.random() * (max-min + 1) + min);
}
