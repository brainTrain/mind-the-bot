const ElizaBot = require('elizabot');

var eliza = new ElizaBot();

function askEliza (message) {
  const reply = eliza.transform(message);

  return reply;
}

function getElizaInitial () {
  const reply = eliza.getInitial();

  return reply;
}

module.exports = {
  askEliza: askEliza,
  getElizaInitial: getElizaInitial,
}
