# Minecraft Botz
_This bot remote controls a normal minecraft account, if you want to play with your bot the easiest way is to just pay for a new mojang account for your bot._

_This bot is built using [mineflayer](https://github.com/PrismarineJS/mineflayer)_

## Basic starting instructions

`npm install`

`npm start`

## Setting up environment

Start by copying the `.env-template` file to a `.env` file

```console
$ cp .env-template .env
```

Set values for the environment variables

| Name | Description | Type |
|------| ------------|------|
| `MC_HOST_IP` | IP of the MC server you want to join. | IPV6 |
| `MC_USERNAME` | Username of the bot's mojang or microsoft account. | String |
| `MC_PASSWORD` | Password for the bot's mojang or microsoft account. | String |
| `MC_AUTH_TYPE` | Type to tell [mineflayer](https://github.com/PrismarineJS/mineflayer) which auth to use.  | `mojang` \| `microsoft`|
| `ACTION_PHRASE` | Word or phrase that the bot should choose as a delimiter. The bot will parse the rest of that chat message as a command and respond appropriately. | String |

## Commands

### Movement
| Command | Description |
|------| ------------|
| "follow me" | Bot follows the user who made the command. |
| "unfollow me", "leave me alone", "go away" | Stops bot from following the user who made the command. |
| "go home", "your home", "your house" | Bot goes to its house coordinates. |
| "spa" | Bot goes to the spa coordinates. |
| "spa pool" | Bot goes to the spa pool coordinates. |
| "roller coaster" | Bot goes to the roller coaster coordinates. |

### Actions
| Command | Description |
|------| ------------|
| "to bed", "to sleep" | Bot goes to bed, you might need to run this one twice for it to work lol. |
| "spin" | Bot does a terrible job at spinning. |
| "eat" | Bot eats until full or food runs out. The bot will also eat automatically if its health and food are low enough. |
| "set chat mode" | Lets you set [chat mode](#chat-modes) for bot. |

#### Chat Modes

##### Default
  * Bot says a random quote if you use the action phrase but your command doesn't match any of the existing commands.

##### Eliza
  * Bot goes into Eliza mode.
    * The user who sets the bot in this mode can talk to the bot without using the action phrase, the bot will respond to all chats this user sends. This currently only works for one user at a time.
  * Bot responds as Eliza if you other users say the action phrase but the command doesn't match any of the existing commands.
  * site: [https://www.masswerk.at/elizabot/](https://www.masswerk.at/elizabot/)
  * npm: [https://www.npmjs.com/package/elizabot](https://www.npmjs.com/package/elizabot)

### Stats
| Command | Description |
|------| ------------|
| "stats" | Bot says what's in its inventory, its health and food levels, and the chat mode. |
| "inventory" | Bot says what's in its inventory. |
| "health" | Bot says its health and food levels. |

### Quotes/Jokes/Facts
| Command | Description |
|------| ------------|
| "cat fact" | Bot says a random [cat fact](#cat-facts)! 😸 |
| "a fact" | Bot says a random [fact](#facts) (we only have cat facts for now). |
| "dad joke" | Bot says a [dad joke](#dad-jokes). |
| "chuck norris joke" | Bot says a [Chuck Norris joke](#chuck-norris-jokes). |
| "a joke" | Bot says a random joke [joke](#jokes). |
| "a quote" | Bot says a random [quote](#quotes). |

### APIs

#### Facts
##### Cat Facts
  * site: [https://catfact.ninja/](https://catfact.ninja/)
  * endpoint: `https://catfact.ninja/fact`

#### Jokes
##### Dad Jokes 
  * site: [https://icanhazdadjoke.com/](https://icanhazdadjoke.com/)
  * endpoint: `https://icanhazdadjoke.com/`
##### Chuck Norris Jokes 
  * site: [https://api.chucknorris.io/](https://api.chucknorris.io/)
  * endpoint: `https://api.chucknorris.io/jokes/random`

#### Quotes
##### Big Lebowskie Quotes
  * site: [http://lebowski.me/api/quotes/random](http://lebowski.me/api/quotes/random)
  * endpoint: `http://lebowski.me/api/quotes/random`
##### Trump Quotes
  * site: [https://api.tronalddump.io/](https://api.tronalddump.io/)
  * endpoint: `https://api.tronalddump.io/random/quote`
##### Always Sunny Quotes
  * site: [http://sunnyquotes.net/api/](http://sunnyquotes.net/api/)
  * endpoint: `http://sunnyquotes.net/q.php?random`
##### Seinfeld Quotes
  * site: [https://seinfeld-quotes.herokuapp.com/](https://seinfeld-quotes.herokuapp.com/)
  * endpoint: `https://seinfeld-quotes.herokuapp.com/random`
##### Nicolas Cage Quotes
  * site: [https://nicolas-cage-quotes.herokuapp.com/quotes](https://nicolas-cage-quotes.herokuapp.com/quotes)
  * endpoint: `https://nicolas-cage-quotes.herokuapp.com/quotes`
##### Type Fit Quotes
  * description: A set of inspirational quotes
  * site: [https://type.fit/api/quotes](https://type.fit/api/quotes)
  * endpoint: `https://type.fit/api/quotes`
