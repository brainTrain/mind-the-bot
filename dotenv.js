require('dotenv').config();

const MCHostIP = process.env.MC_HOST_IP;
const MCUsername = process.env.MC_USERNAME;
const MCPassword = process.env.MC_PASSWORD;
const MCAuthType = process.env.MC_AUTH_TYPE;
const MCMyPlayerUsername = process.env.MC_MY_PLAYER_USERNAME;

module.exports = {
  MCHostIP,
  MCUsername,
  MCPassword,
  MCAuthType,
  MCMyPlayerUsername,
};
