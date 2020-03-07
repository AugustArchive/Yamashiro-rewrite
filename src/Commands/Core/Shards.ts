import { YamashiroClient, Command, Context } from '../../Structures';
import { table, TableConfig } from 'table';
import { stripIndents } from 'common-tags';
import { DiscordEmoji } from '../../Utils/Constants';

export default class extends Command {
    constructor(bot: YamashiroClient) {
        super(bot, {
            name: 'shards',
            description: 'Shows information on all shards',
            moduleID: 'core'
        });
    }

    get tableConfig(): TableConfig {
        return {
            border: {
                topBody: '-',
                topJoin: '+',
                topLeft: '+',
                topRight: '+',
                bottomBody: '-',
                bottomJoin: '+',
                bottomLeft: '+',
                bottomRight: '+',
                bodyLeft: '|',
                bodyRight: '|',
                bodyJoin: '|',
                joinBody: '-',
                joinLeft: '+',
                joinRight: '+',
                joinJoin: '+'
            },
            drawHorizontalLine: (i: number, s: number) => i === 0 || i === 1 || i === s
        };
    }

    async run(ctx: Context) {
        const msg = await ctx.send(`${DiscordEmoji.INFO} **| Grabbing shard data...**`);
        const started = Date.now();

        let content = [
            ['ID', 'Status', 'Latency', 'Guilds', 'Users']
        ];

        for (const shard of this.bot.shards.values()) {
            const data = this.bot.getShardInfo(shard.id)!;
            const is   = shard.id === ctx.guild.shard.id;
            content.push([
                `${is? '>': ''} #${data.id}`,
                data.status,
                `${data.latency}ms`,
                data.guilds.format(),
                data.users.format()
            ]);
        }

        await msg.delete();
        return void ctx.embed(
            this
                .bot
                .getEmbed()
                .setAuthor(`| ${this.bot.user.tag} - Shard Information`, undefined, this.bot.avatar)
                .setDescription(stripIndents`
                    **Fetched in ${(Date.now() - started).format()}ms**
                    \`\`\`prolog
                    ${table(content, this.tableConfig)}
                    \`\`\`
                `)
                .build()
        );
    }
}