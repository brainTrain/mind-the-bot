const mineflayer = require('mineflayer');
const { pathfinder, Movements } = require('mineflayer-pathfinder');
const { GoalNear, GoalFollow } = require('mineflayer-pathfinder').goals;
const mineflayerViewer = require('prismarine-viewer').mineflayer;
const fs = require('fs');

const {
  MCHostIP,
  MCPassword,
  MCUsername,
  MCAuthType,
} = require('./dotenv');

// globals to reuse movement declarations, maybe a bad thing, guess we'll see
let movements;

const options = {
  auth: MCAuthType,
  host: MCHostIP,
  username: MCUsername,
  password: MCPassword,
};

const BOT_HOME = {
  x: -192.278,
  y: 68,
  z: -22.380,
};

const ROLLER_COASTER = {
  x: -268.284,
  y: 67,
  z: -264.201,
};
const ACTION_PHRASE = 'hey asshole';

const bot = mineflayer.createBot(options);
bot.loadPlugin(pathfinder);

bot.once('spawn', () => {
  mineflayerViewer(bot, { port: 3000 });
  initBotMovement();
});

bot.on('spawn', () => {
  // -1 is to discount yourself
  if (Object.keys(bot.players).length - 1) {
    bot.chat('whaddup nerdzzz??!!1');
  } else {
    bot.chat('all by myself');
  }

  moveToCoordinates(bot, BOT_HOME, movements);
});

bot.on('goal_reached', (goal) => {
  console.trace('shiiiiiiiittttt');
  console.log('goal_reached', goal);
  console.log('bot.entity.position', bot.entity.position);

  bot.chat('OMG I did it!!1');
});

bot.on('chat', (username, message) => {
  console.log('username', username);
  console.log('message', message);
  const hasAction = message
    .toLowerCase()
    .includes(ACTION_PHRASE);

  if (username !== MCUsername && hasAction) {
    const command = message.split(ACTION_PHRASE)[1].toLowerCase();

    if (command.includes('follow me')) {
      const player = bot.players[username];
      followPlayer(bot, player, movements);
    }

    if (command.includes('teleport to me')) {
      bot.chat(`/teleport ${username}!`);
    }

    const shouldGoHome = command.includes('go home') ||
      command.includes('go away') ||
      command.includes('your home') ||
      command.includes('your house');
    if (shouldGoHome) {
      bot.chat('ok, going to my house... :/');
      moveToCoordinates(bot, BOT_HOME, movements);
    }

    if (command.includes('fuck you')) {
      bot.chat(`fuck you too ${username}!`);
    }

    const shouldGoToBed = command.includes('to bed') ||
      command.includes('to sleep');
    if (shouldGoToBed) {
      const bedBlocks = findBedBlocks();

      if (bedBlocks) {
        moveToCoordinates(bot, bedBlocks.position, movements);
        goToSleep(bedBlocks);
      } else {
        bot.chat('can\'t find any beds, boss :(');
      }
    }

    const shouldGoToRollerCoaster = command.includes('rollercoaster') ||
      command.includes('roller coaster');
    if (shouldGoToRollerCoaster) {
      moveToCoordinates(bot, ROLLER_COASTER, movements);
    }

    if (command.includes('spin')) {
      lookAround(20);
    }

    if (command.includes('restart')) {
      restartNodemon();
    }
  }
});

function lookAround (total, prevYaw, prevPitch, totalSame) {
  let yaw = yourMomsNumber(0, 10) ? 0 : 3.142;
  const pitch = yourMomsNumber(0, 10) ? 1.2 : -1.2;
  // (poor) attempt at making it feel more random for humanz
  if (prevYaw === yaw) {
    totalSame = (totalSame || 0) + 1;
  } else {
    totalSame = 0;
  }

  if (totalSame > 2) {
    totalSame = 0;
    if (yaw !== 0) {
      yaw = 0;
    } else {
      yaw = 3.14;
    }
  }

  return bot.look(yaw, pitch).then(() => {
    if (total !== 0) {
      lookAround(total - 1, yaw, pitch, totalSame);
    } else {
      bot.look(0, 0);
    }
  });
}

function findBedBlocks () {
  const bedBlocks = bot.findBlock({
    maxDistance: 5,
    matching: (block) => {
      if (bot.isABed(block)) {
        return block;
      }
    },
  });

  return bedBlocks
}

function goToSleep (bedBlocks) {
  return bot.sleep(bedBlocks)
    .catch((error) => {
      if (error.message !== 'it\'s not night') {
        console.error(error.stack);
      }
    });
}

function followPlayer (bot, player, movements) {
  const goal = new GoalFollow(player.entity, 1);
  goal.goalFunction = 'followPlayer(bot, ' + JSON.stringify(player) + ')';
  
  // movement stuffs
  movements.canDig = false;

  // bot stuffs
  bot.pathfinder.setGoal(goal, true);
}

function moveToCoordinates (bot, coordinates, movements) {
  const goal = new GoalNear(coordinates.x, coordinates.y, coordinates.z, 1);
  goal.goalFunction = 'moveToCoordinates(bot, ' + JSON.stringify(coordinates) + ')';
  
  // movement stuffs
  movements.canDig = false;

  // bot stuffs
  bot.pathfinder.setGoal(goal);
}


function initBotMovement () {
  const MCData = initMCData(bot.version);
  movements = new Movements(bot, MCData);
  bot.pathfinder.setMovements(movements);
}

function initMCData (botVersion) {
  return require('minecraft-data')(botVersion);
}

// utilz
function yourMomsNumber (min, max) {
    return Math.floor(Math.random() * (max-min + 1) + min);
}

// process handling for restarts
process.on('uncaughtException', function (error) {
  restartNodemon(); 
});

function restartNodemon() {
  // lovingly lifted from https://remarkablemark.org/blog/2017/12/17/touch-file-nodejs/
  // > fs.utimesSync is used here to prevent existing file contents from being overwritten.
  // > It also updates the last modification timestamp of the file, which is consistent with what POSIX touch does.

  const filename = 'index.js';
  const time = new Date();

  try {
    fs.utimesSync(filename, time, time);
  } catch (error) {
    fs.closeSync(fs.openSync(filename, 'w'));
  }
}
