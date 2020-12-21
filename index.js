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
  x: -192.84177554267393,
  y: 71,
  z: -118.13736571556387,
};

const bot = mineflayer.createBot(options);
bot.loadPlugin(pathfinder);

bot.on('spawn', () => {
  const myPlayer = bot.players[MCMyPlayerUsername];

  if (myPlayer) {
    bot.chat('broooooooooooooooooo !!!!!!');
    followPlayer(bot, myPlayer);
  } else {
    bot.chat('all by myself');
  }
});


function followPlayer (bot, player) {
  const MCData = initMCData(bot.version);
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

function initMCData (botVersion) {
  return require('minecraft-data')(botVersion);
}
