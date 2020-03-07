import { YamashiroClient, Task, Colors } from '../Structures';
import { post } from 'wumpfetch';

export default class BotlistTask extends Task {
    constructor(bot: YamashiroClient) {
        super(bot, {
            interval: 900000,
            name: 'botlists'
        });
    }

    async run() {
        //* If the bot's environment is "dev"     or the bot's id is my test bot's ID
        if (this.bot.config.environment === 'dev' || this.bot.user.id === '508842721545289731') {
            this.bot.logger.warn(`Bot's environment is ${Colors.yellow('development')}, skipping botlists task...`);
            return;
        }

        this.bot.logger.info('Now starting to post to botlists...');
        if (this.bot.config.botlists.bfd) {
            this.bot.logger.info(`Bots for Discord key was found! ${Colors.green('Now posting...')}`);
            await post({
                url: `https://botsfordiscord.com/api/bot/${this.bot.user.id}`,
                data: {
                    'server_count': this.bot.guilds.size
                }
            })
                .header({
                    'Authorization': this.bot.config.botlists.bfd,
                    'Content-Type': 'application/json'
                })
                .send()
                .then(res => {
                    const response = res.body instanceof Buffer? res.body.toString(): res.body;
                    this.bot.logger.info(`Successfully posted to ${Colors.green('Bots for Discord')}! Received ${res.statusCode} with:\n${response}`);
                })
                .catch(error => this.onReject('bfd', error));
        }

        if (this.bot.config.botlists.luke) {
            this.bot.logger.info(`Discord Bot List v2 key was found! ${Colors.green('Now posting...')}`);
            const users = this.bot.guilds.reduce((prev, curr) => prev + curr.memberCount, 0);
            await post({
                url: `https://discordbotlist.com/api/bots/${this.bot.user.id}/stats`,
                data: {
                    'guild_count': this.bot.guilds.size,
                    'user_count': users
                }
            })
                .header({
                    'Authorization': `Bot ${this.bot.config.botlists.luke}`,
                    'Content-Type': 'application/json'
                })
                .send()
                .then(res => {
                    const response = res.body instanceof Buffer? res.body.toString(): res.body;
                    this.bot.logger.info(`Successfully posted to ${Colors.green('Discord Bot List v2')}! Received ${res.statusCode} with:\n${response}`);
                })
                .catch(error => this.onReject('dbl', error));
        }

        if (this.bot.config.botlists.mythical) {
            this.bot.logger.info(`Mythical Bots key was found! ${Colors.green('Now posting...')}`);
            await post({
                url: `https://mythicalbots.xyz/api/bot/${this.bot.user.id}`,
                data: {
                    'server_count': this.bot.guilds.size
                }
            })
                .header({
                    'Authorization': this.bot.config.botlists.mythical,
                    'Content-Type': 'application/json'
                })
                .send()
                .then(res => {
                    const body = res.body instanceof Buffer? res.body.toString(): res.body;
                    this.bot.logger.info(`Successfully posted to ${Colors.green('Mythical Bots')}! Status Code (${res.statusCode}):\n${body}`);
                })
                .catch(error => this.onReject('myth', error));
        }

        if (this.bot.config.botlists.oliy) {
            this.bot.logger.info(`top.gg key was found! ${Colors.green('Now posting...')}`);
            await post({
                url: `https://top.gg/api/bots/${this.bot.user.id}/stats`,
                data: {
                    'server_count': this.bot.guilds.size,
                    'shard_count': this.bot.shards.size
                }
            })
                .header({
                    'Authorization': this.bot.config.botlists.oliy,
                    'Content-Type': 'application/json'
                })
                .send()
                .then(res => {
                    const body = res.body instanceof Buffer? res.body.toString(): res.body;
                    this.bot.logger.info(`Posted to ${Colors.green('top.gg!')} Response (${res.statusCode}):\n${body}`);
                })
                .catch(error => this.onReject('oliy', error));
        }

        if (this.bot.config.botlists.unto) {
            this.bot.logger.info(`discord.boats key was found! ${Colors.green('now posting...')}`);
            await post({
                url: `https://discord.boats/api/bot/${this.bot.user.id}`,
                data: {
                    'server_count': this.bot.guilds.size
                }
            })
                .header({
                    'Authorization': this.bot.config.botlists.unto,
                    'Content-Type': 'application/json'
                })
                .send()
                .then(res => {
                    const body = res.body instanceof Buffer? res.body.toString(): res.body;
                    this.bot.logger.info(`Posted to ${Colors.gray('discord.boats')}! Response (${res.statusCode}):\n${body}`);
                })
                .catch(error => this.onReject('unto', error));
        }

        if (this.bot.config.botlists.dbb) {
            this.bot.logger.info(`discordsbestbots.xyz key was found! ${Colors.green('now posting..')}`);
            await post({
                url: `https://discordsbestbots.xyz/api/bots/${this.bot.user.id}/stats`,
                data: {
                    guilds: this.bot.guilds.size
                }
            })
                .header({
                    'Authorization': this.bot.config.botlists.dbb,
                    'Content-Type': 'application/json'
                })
                .send()
                .then(res => {
                    const body = res.body instanceof Buffer? res.body.toString(): res.body;
                    this.bot.logger.info(`Posted to ${Colors.gray('discordsbestbots.xyz')}! Response (${res.statusCode}):\n${body}`);
                })
                .catch(error => this.onReject('dbb', error));
        }
    }

    onReject(type: 'bfd' | 'oliy' | 'unto' | 'dbl' | 'myth' | 'dbb', error: any) {
        const name: string = {
            oliy: 'top.gg',
            unto: 'discord.boats',
            myth: 'mythicalbots.xyz',
            dbl: 'discordbotlist.com',
            bfd: 'botsfordiscord.com',
            dbb: 'discordsbestbots.xyz'
        }[type];

        this.bot.logger.error(`Unable to post to ${Colors.red(name)}:\n${error}`);
    }
}
