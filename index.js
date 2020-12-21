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

// globals to reuse movement declarations, maybe a bad thing, guess we'll see
let MCData, movements;

const options = {
  auth: MCAuthType,
  host: MCHostIP,
  username: MCUsername,
  password: MCPassword,
};

const SPAWN_POINT = {
  x: -192.278,
  y: 68,
  z: -22.380,
};

const bot = mineflayer.createBot(options);
bot.loadPlugin(pathfinder);

bot.once('spawn', () => {
  mineflayerViewer(bot, { port: 3000 });
  initBotMovement();
});

bot.on('spawn', () => {
  const myPlayer = bot.players[MCMyPlayerUsername];

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


function initBotMovement () {
  MCData = initMCData(bot.version);
  movements = new Movements(bot, MCData);
}

function initMCData (botVersion) {
  return require('minecraft-data')(botVersion);
}

