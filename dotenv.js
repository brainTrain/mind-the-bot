require('dotenv').config();

const MCHostIP = process.env.MC_HOST_IP;
const MCUsername = process.env.MC_USERNAME;
const MCPassword = process.env.MC_PASSWORD;
const MCAuthType = process.env.MC_AUTH_TYPE;
const actionPhrase = process.env.ACTION_PHRASE;

module.exports = {
  actionPhrase,
  MCHostIP,
  MCUsername,
  MCPassword,
  MCAuthType,
};
