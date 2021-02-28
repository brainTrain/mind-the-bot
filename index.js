const mineflayer = require('mineflayer');
const { pathfinder, Movements } = require('mineflayer-pathfinder');
const { GoalNear, GoalFollow } = require('mineflayer-pathfinder').goals;
// const mineflayerViewer = require('prismarine-viewer').mineflayer;
const fs = require('fs');
const {
  fetchRandomCatFact,
  fetchRandomChuckNorrisJoke,
  fetchRandomDadJoke,
  fetchRandomFact,
  fetchRandomJoke,
  fetchRandomQuote,
  fetchRandomResponse,
} = require('./get-quote');
console.log(new Date(), 'starting a thing');

const {
  MCAuthType,
  MCHostIP,
  MCPassword,
  MCUsername,
  actionPhrase,
} = require('./dotenv');
const {
  BOT_HOME,
  ROLLER_COASTER,
  SPA,
  SPA_POOL,
} = require('./locations');
 
// globals to reuse movement declarations, maybe a bad thing, guess we'll see
let movements;

const options = {
  auth: MCAuthType,
  host: MCHostIP,
  password: MCPassword,
  username: MCUsername,
};

const bot = mineflayer.createBot(options);
bot.loadPlugin(pathfinder);

// globals for re-use
let MCData;

bot.once('spawn', () => {
  // mineflayerViewer(bot, { port: 3000 });
  initBotMovement();
  initBotSpeech();
  console.log(new Date(), 'oh dang a first spawn');
});

bot.on('spawn', () => {
  // -1 is to discount yourself (the bot)
  const hasPlayers = Object.keys(bot.players).length - 1;
  if (hasPlayers) {
    bot.chat('whaddup nerdzzz??!!1');
  } else {
    bot.chat('all by myself');
  }

  moveToCoordinates(bot, BOT_HOME, movements, 'just got home');
});

bot.on('health', () => {
  if (bot.health < 15) {
    eatUntilFull();
  }
});

bot.on('goal_reached', (goal) => {
  const botMessage = goal.message || 'OMG I did it!!1';
  bot.chat(botMessage);
  console.log(new Date(), 'goal_reached', goal);
});

bot.on('chat', (username, message) => {
  console.log(new Date(), 'username', username);
  console.log(new Date(),'message', message);
  const hasAction = message
    .toLowerCase()
    .includes(actionPhrase);

  if (username !== MCUsername && hasAction) {
    const command = message.split(actionPhrase)[1].toLowerCase();
    const player = bot.players[username];

    // unfollow needs to happen before follow cuz
    // 'follow me' is a substring of 'unfollow me'
    const shouldUnFollow = command.includes('unfollow me') ||
      command.includes('leave me alone');
    if (shouldUnFollow) {
      bot.chat(`fine, ${username}, peace oooot`);
      cancelGoal(bot, player, movements);

      return;
    }

    if (command.includes('follow me')) {
      bot.chat(`ok ${username}, hold your horses, I'm comin`);
      followPlayer(bot, player, movements);

      return;
    }

    if (command.includes('teleport to me')) {
      bot.chat(`/teleport ${username}!`);

      return;
    }

    const shouldGoHome = command.includes('go home') ||
      command.includes('go away') ||
      command.includes('your home') ||
      command.includes('your house');
    if (shouldGoHome) {
      bot.chat('ok, going to my house... :/');
      moveToCoordinates(bot, BOT_HOME, movements, 'just got home');

      return;
    }

    if (command.includes('fuck you')) {
      bot.chat(`fuck you too ${username}!`);

      return;
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

      return;
    }

    const shouldGoToRollerCoaster = command.includes('rollercoaster') ||
      command.includes('roller coaster');
    if (shouldGoToRollerCoaster) {
      bot.chat('sweet, roller coaster time!');
      moveToCoordinates(bot, ROLLER_COASTER, movements, 'just got to the roller coaster!');

      return;
    }

    if (command.includes('spa pool')) {
      bot.chat('spa pool time');
      moveToCoordinates(bot, SPA_POOL, movements, 'I like turtles.');

      return;
    }

    if (command.includes('spa')) {
      bot.chat('spa time');
      moveToCoordinates(bot, SPA, movements, 'What is your spaghetti policy here?');

      return;
    }

    if (command.includes('spin')) {
      lookAround(20);

      return;
    }

    if (command.includes('eat')) {
      eatUntilFull();

      return;
    }

    if (command.includes('health')) {
      bot.chat(`my health is at ${bot.health} and my food is at ${bot.food}`);

      return;
    }

    if (command.includes('inventory')) {
      console.log(new Date(), 'inventory', bot.inventory);

      bot.chat(`I have ${displayInventoryItems()}`);

      return;
    }

    if (command.includes('stats')) {
      console.log(new Date(), 'inventory', bot.inventory);

      bot.chat(`my health is at ${bot.health} and my food is at ${bot.food}`);
      bot.chat(`I have ${displayInventoryItems()}`);

      return;
    }

    if (command.includes('restart')) {
      restartNodemon();

      return;
    }

    if (command.includes('cat fact')) {
      sayFetch(fetchRandomCatFact, 'cat fact');

      return;
    }

    if (command.includes('dad joke')) {
      sayFetch(fetchRandomDadJoke, 'dad joke');
      return;
    }

    if (command.includes('chuck norris joke')) {
      sayFetch(fetchRandomChuckNorrisJoke, 'chuck norris joke');
      return;
    }

    if (command.includes('a joke')) {
      sayFetch(fetchRandomJoke, 'joke');
      return;
    }

    if (command.includes('a quote')) {
      sayFetch(fetchRandomQuote, 'quote');
      return;
    }

    if (command.includes('a fact')) {
      sayFetch(fetchRandomFact, 'fact');
      return;
    }

    // if none match, fetch and display a random response from one of the endpoints
    sayFetch(fetchRandomResponse, 'response');
  }
});


// stop trying to make fetch a thing
function sayFetch (fetchSource, name) {
  console.log('name', name);
  console.log('fetchSource', fetchSource);
  return fetchSource()
    .then((data) => {
      bot.chat(data.quote);
    })
    .catch(() => {
      bot.chat(`derp derp, failed to fetch ${name} for some reason :/`);
    });
}

function displayInventoryItems () {
  const inventoryNameList = getInventoryItems().map((item) => item.displayName);

  return inventoryNameList.join(', ');
}

function getInventoryItems () {
  // filters out null items
  return bot.inventory.slots.filter((item) => item);
}

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

function equipFood(callback) {
  const items = getInventoryItems();
  // just get the first food item and break out
  const MCDataFoodNames = MCData.foodsArray.map((item) => item.name);
  const food = items.find((item) => MCDataFoodNames.includes(item.name));

  if (food) {
    bot
      .equip(food, 'hand')
      .then(callback)
      .catch((error) => console.error('error in equipFood', error));
  }
}

function eatUntilFull () {
  if (bot.food < 20) {
    equipFood(() => {
      eat()
        .then(eatUntilFull)
        .catch((error) => console.error('eating error', error));
    });
  } else {
    bot.chat('me no hungee');
  }
}

function eat () {
  return bot.consume();
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
  // if the player's too far away their entity will be null and you won't be able to follow them
  if (!player.entity) {
    console.error('ZOMGZ this player has no entity!!1', player);
    bot.chat(`you're too far away ${player.username}`);
    return;
  }
  const goal = new GoalFollow(player.entity, 1);
  
  // movement stuffs
  movements.canDig = false;
  // bot stuffs
  bot.pathfinder.setGoal(goal, true);
}

function cancelGoal (bot, player, movements) {
  bot.pathfinder.setGoal(null);
}

function moveToCoordinates (bot, coordinates, movements, message) {
  const goal = new GoalNear(coordinates.x, coordinates.y, coordinates.z, 1);
  if (message) {
    goal.message = message;
  }
  
  // movement stuffs
  movements.canDig = false;

  // bot stuffs
  bot.pathfinder.setGoal(goal);
}


function initBotSpeech () {
  // one hour
  setInterval(() => {
    sayFetch(fetchRandomResponse, 'response');
  }, 1000 * 60 * 60);
}

function initBotMovement () {
  MCData = initMCData(bot.version);
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
  console.error(error);
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
