const {
  MCHostIP,
  MCPassword,
  MCUsername,
  MCAuthType,
  MCMyPlayerUsername,
} = require('./dotenv');
const mineflayer = require('mineflayer');
const { pathfinder, Movements} = require('mineflayer-pathfinder');
const { GoalNear, GoalFollow } = require('mineflayer-pathfinder').goals;

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

bot.on('spawn', () => {
  const myPlayer = bot.players[MCMyPlayerUsername];
  const MCData = initMCData(bot.version);

  if (myPlayer) {
    bot.chat('broooooooooooooooooo !!!!!!');
    followPlayer(bot, myPlayer, MCData);
  } else {
    bot.chat('all by myself');
    moveToCoordinates(bot, SPAWN_POINT, MCData);
  }
});


function followPlayer (bot, player, MCData) {
  const movements = new Movements(bot, MCData);
  const goal = new GoalFollow(player.entity, 1);
  // const goal = new GoalNear(SPAWN_POINT.x, SPAWN_POINT.y, SPAWN_POINT.z, 1);
  
  // movement stuffs
  movements.canDig = false;

  // bot stuffs
  bot.chat(`yooooooooooooooooooo ${player.username} !!!!!!`);
  bot.pathfinder.setMovements(movements);
  bot.pathfinder.setGoal(goal, true);
}

function moveToCoordinates (bot, coordinates, MCData) {
  const movements = new Movements(bot, MCData);
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
