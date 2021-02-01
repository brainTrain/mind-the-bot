# minecraft botz
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
| `MC_USERNAME` | Username of the bot's mojang account. | String |
| `MC_PASSWORD` | Password for the bot's mojang account. | String |
| `MC_AUTH_TYPE` | Type to tell [mineflayer](https://github.com/PrismarineJS/mineflayer) which auth to use.  | `mojang` \| `microsoft`|
| `ACTION_PHRASE` | Word or phrase that the bot should choose as a delimiter. The bot will parse the rest of that chat message as a command and respond appropriately. | String |
