<img src="./assets/icon.jpg" width="150" height="150" style="align: center;" />
<h1 style="align: center;">Yamashiro</h1>

[![Discord](https://discordapp.com/api/guilds/382725233695522816/embed.png)](https://discord.gg/yDnbEDH) [![License](https://img.shields.io/badge/License-MIT-C495F0.svg?style=flat-square)](https://github.com/auguwu/Yamashiro/blob/master/LICENSE) [![Maintained with TypeScript](https://img.shields.io/badge/Maintained%20with-TypeScript-007ACC.svg?style=flat-square)](https://github.com/microsoft/TypeScript) [![Workflows: Ubuntu](https://github.com/auguwu/Yamashiro/workflows/Ubuntu/badge.svg)](https://github.com/auguwu/Yamashiro) [![Build Status](https://travis-ci.org/auguwu/Yamashiro.svg?branch=master)](https://travis-ci.org/auguwu/Yamashiro) [![Build status](https://ci.appveyor.com/api/projects/status/2t8pixmyd6crlwsl?svg=true)](https://ci.appveyor.com/project/ohlookitsAugust/Yamashiro)

> **Robust, multifunctional [Discord](https://discordapp.com) bot made in the [Eris](https://abal.moe/Eris) using [TypeScript](https://github.com/microsoft/TypeScript)**

## Features
- **Useless commands**: Plenty of commands to keep you busy if you're bored
- **Twitch/Mixer/Reddit Feeds**: Get the latest information on anything

## Libraries Revised
- [ohlookitsderpy/leeks.js](https://github.com/ohlookitsderpy/leeks.js)

## Commands (56)
### Core (11)
- `s;changelog`: Shows the changelog in the #changelog channel in my community server
- `s;cmdusages`: Shows a table of what command has been executed and how many users have executed it
- `s;config`: The configuration command, to set/delete/add/reset/remove stuff from the database
- `s;donate`: Shows information on how to donate to me~
- `s;help`: Shows a list of my commands or gives documentation on a command/module
- `s;invite`: Invites me to your server or join mine!
- `s;ping`: Shows the latency from me to Discord
- `s;prefix`: Shows or changes the prefix
- `s;shards`: Shows a table of my shards
- `s;statistics`: Shows some realtime statistics about me
- `s;uptime`: How long I was up for

### Images (4)
- `s;coffee`: Grab a random photo of Coffee, so soothen your day
- `s;mue`: Grabs a random photo from [Mue](https://muetab.xyz)
- `s;nature`: Random photo of Nature
- `s;space`: Random photo of Space

### Miscellaneous (4)
- `s;disable`: Disables a command or module in the guild
- `s;enable`: Enables a disabled command or module in the guild
- `s;subscribe`: Subscribe to any subscription roles the guild administrators has set
- `s;unsubscribe`: Unsubscribe from any subscription role

### Upvoter (2)
> Note: You will need to upvote on [discord.boats](https://discord.boats/bot/yamashiro) to access these commands

- `s;alart`: Show some lood azur lane art
- `s;nekopara`: Show some lood Nekopara art

### Utility (13)
- `s;boost`: Shows the avaliable nitro boosters in the guild
- `s;botlist`: Shows the top 10 bots on Carbonitex
- `s;channelinfo`: Shows information about a text/voice/category/news/store channel
- `s;hex-rgb`: Converts a hexadecimal to RGB values
- `s;hti`: Converts a hexadecimal to a integer
- `s;ith`: Converts a integer to a hexadecimal
- `s;pypi`: Shows information about a package on Python Package Index
- `s;overwrites`: Get all the permission overwrites for roles/members in a specific channel
- `s;roleinfo`: Shows information about a role in the guild
- `s;serverinfo`: Shows information about the guild
- `s;snipe`: Snipes a message
- `s;twitch`: Shows information about a Twitch user or shows the top 5 games being streamed
- `s;userinfo`: Shows information about yourself or another user

### Weeb (23)
- `s;anime`: Searches for an anime from Kitsu or shows a random anime photo
- `s;aoki`: Shows a random image of the vocaloid: Aoki
- `s;azurlane`: Shows information about a shipgirl or show the skins she has
- `s;diva`: Shows a random image from Project Diva
- `s;fukase`: Shows a random image of the vocaloid: Fukase
- `s;gumi`: Shows a random image of the vocaloid: Gumi
- `s;ia`: Shows a random image of the vocaloid: IA
- `s;kaito`: Shows a random image of the vocaloid: Kaito
- `s;kon`: Shows a random image from K-ON!
- `s;konosuba`: Shows a random image from Konosuba
- `s;len`: Shows a random image of the vocaloid: Len
- `s;lily`: Shows a random image of the vocaloid: Lily
- `s;lovelive`: Shows a random from Love Live!
- `s;luka`: Shows a random image of the vocaloid: Luka
- `s;mayu`: Shows a random image of the vocaloid: Mayu
- `s;manga`: Searches for a manga from Kitsu
- `s;meiko`: Shows a random image of the vocaloid: Meiko
- `s;miki`: Shows a random image of the vocaloid: Miki
- `s;miku`: Shows a random image of the vocaloid: Miku
- `s;osu`: Shows information on an osu! beatmap/user/user top plays
- `s;takagi`: Shows a random image of Takagi
- `s;teto`: Shows a random image of the vocaloid: Teto
- `s;yukari`: Shows a random image of the vocaloid: Yukari

## Installation
> For building, use the `:npm` suffix since without it, it'll default to Yarn (i.e: `build:watch:npm`)

```sh
$ git clone https://github.com/auguwu/Yamashiro.git && cd Yamashiro
$ npm i -g eslint typescript
$ yarn
$ yarn build
$ cd dist && node bot.js
```

### Requirements
- Node.js
- MongoDB
- Redis

### Configuration
```yml
environment: "dev"
databaseUrl: "mongodb://localhost:27017/Yamashiro"
webhookUrl: ""
sentryDSN: ""
apiKey: ""
discord:
  prefix: 's;'
  token: ''
redis:
  host: 'localhost'
  port: 6379
apis:
  august: ''
  builder: ''
  chewey: ''
  omdb: ''
  ppy: ''
  twitch: ''
  igdb: ''
  wordnik: ''
botlists:
  mythical: ''
  luke: ''
  oliy: ''
  unto: ''
  bfd: ''
  dbb: ''
```

## Related Projects
- [shipgirl.augu.dev](https://github.com/auguwu/shipgirl.augu.dev) - **Website for Yamashiro made in Vue and Nuxt**

## LICENSE
> The [Yamashiro](https://shipgirl.augu.dev) Project is made by [August](https://augu.dev) and released under the **MIT** License.

```
Copyright (c) 2018-2019 August

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

[![Discord Server](https://canary.discordapp.com/api/guilds/382725233695522816/embed.png?style=banner1)](https://discord.gg/yDnbEDH)
[![discord.boats](https://discord.boats/api/widget/447229568282132510)](https://discord.boats/bot/yamashiro)
[![top.gg](https://top.gg/api/widget/447229568282132510.svg)](https://top.gg/bot/447229568282132510)
[![botsfordiscord.com](https://botsfordiscord.com/api/bot/447229568282132510/widget?theme=dark)](https://botsfordiscord.com/bot/447229568282132510)
[![discordbotlist.com](https://discordbotlist.com/bots/447229568282132510/widget)](https://discordbotlist.com/bots/447229568282132510)