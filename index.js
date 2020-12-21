const {
  MCHostIP,
  MCPassword,
  MCUsername,
  MCAuthType,
  MCMyPlayerUsername,
} = require('./dotenv');
const mineflayer = require('mineflayer');
const { pathfinder, Movements } = require('mineflayer-pathfinder');
const { GoalNear, GoalFollow } = require('mineflayer-pathfinder').goals;
const mineflayerViewer = require('prismarine-viewer').mineflayer;

const options = {
  auth: MCAuthType,
  host: MCHostIP,
  username: MCUsername,
  password: MCPassword,
};

const SPAWN_POINT = {
  x: -224.570,
  y: 67,
  z: -125.879,
};

const bot = mineflayer.createBot(options);
bot.loadPlugin(pathfinder);

bot.once('spawn', () => {
  mineflayerViewer(bot, { port: 3000 });
});

bot.on('spawn', () => {
  const myPlayer = bot.players[MCMyPlayerUsername];
  const MCData = initMCData(bot.version);
  const movements = new Movements(bot, MCData);

  if (myPlayer) {
    bot.chat('broooooooooooooooooo !!!!!!');
    followPlayer(bot, myPlayer, movements);
  } else {
    bot.chat('all by myself');
    moveToCoordinates(bot, SPAWN_POINT, movements);
  }
});


function followPlayer (bot, player, movements) {
  const goal = new GoalFollow(player.entity, 1);
  
  // movement stuffs
  movements.canDig = false;

  // bot stuffs
  bot.chat(`yooooooooooooooooooo ${player.username} !!!!!!`);
  bot.pathfinder.setMovements(movements);
  bot.pathfinder.setGoal(goal, true);
}

function moveToCoordinates (bot, coordinates, movements) {
  const goal = new GoalNear(coordinates.x, coordinates.y, coordinates.z, 1);
  
  // movement stuffs
  movements.canDig = false;

  // bot stuffs
  bot.pathfinder.setMovements(movements);
  bot.pathfinder.setGoal(goal, true);
}

function initMCData (botVersion) {
  return require('minecraft-data')(botVersion);
}
