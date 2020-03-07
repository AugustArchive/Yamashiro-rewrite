import { YamashiroClient, Command, Context } from '../../Structures';
import { humanize, dateformat } from '@yamashiro/modules';
import { version as Mongoose } from 'mongoose';
import { VERSION as Eris } from 'eris';
import { version as TS } from 'typescript';
import { totalmem } from 'os';
import { VERSION } from '../../Utils/Constants';
import Util from '../../Utils/Util';

export default class extends Command {
    constructor(bot: YamashiroClient) {
        super(bot, {
            name: 'statistics',
            description: 'Shows a realtime-based statistics panel',
            moduleID: 'core',
            aliases: ['stats', 'botinfo', 'bot', 'info']
        });
    }

    async run(ctx: Context) {
        const mostUsed = this.bot.statistics.getMostUsedCommand();
        const mongodb  = await this.bot.database.getBuild();
        const commits  = await this.bot.octokit.getCommits(3);

        return void ctx.embed(
            this
                .bot
                .getEmbed()
                .setAuthor(`| ${this.bot.user.tag} - Realtime Statistics`, undefined, this.bot.avatar)
                .setThumbnail(this.bot.avatar)
                .setDescription(commits === null? 'Unable to fetch commits': commits.map(s => {
                    const date = new Date(s.commit.author.date).getTime();
                    return `[\`${s.sha.slice(0, 7)}\`](${s.commit.url}) **${s.commit.message}** by ${s.commit.author.name} at ${dateformat(date, 'mm/dd/yyyy hh:MM:ss TT')}`;
                }).join('\n'))
                .addField('Guilds', this.bot.guilds.size.format(), true)
                .addField('Users', this.bot.guilds.reduce<number>((prev, curr) => prev + curr.memberCount, 0).format(), true)
                .addField('Channels', Object.keys(this.bot.channelGuildMap).length.format(), true)
                .addField('Shards [C/T]', `**${ctx.guild.shard.id}**/**${this.bot.shards.size}**`, true)
                .addField('Uptime', humanize(Date.now() - this.bot.startTime), true)
                .addField('Memory Usage', `${Util.parseMemory(process.memoryUsage().heapUsed)}/${Util.parseMemory(totalmem())} (${((process.memoryUsage().heapUsed / totalmem()) * 100).toFixed(2)}%)`, true)
                .addField('Eris Version', `v${Eris}`, true)
                .addField('TypeScript Version', `v${TS}`, true)
                .addField('MongoDB Version', `${mongodb.version} (**${mongodb.gitVersion.slice(0, 7)}**)`, true)
                .addField('Mongoose Version', `v${Mongoose}`, true)
                .addField('Node.js Version', process.version, true)
                .addField('Yamashiro Version', `v${VERSION} (**${this.bot.commit}**)`, true)
                .addField('Messages Seen', this.bot.statistics.messagesSeen.format(), true)
                .addField('Commands Executed', this.bot.statistics.commandsExecuted.format(), true)
                .addField(`Most Used Command [${mostUsed.uses} Uses]`, `**${mostUsed.command}**`, true)
                .build()
        );
    }
}