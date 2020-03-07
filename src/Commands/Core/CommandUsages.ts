import { YamashiroClient, Command, Context } from '../../Structures';
import { table, TableConfig } from 'table';
import { DiscordEmoji } from '../../Utils/Constants';

export default class extends Command {
    constructor(bot: YamashiroClient) {
        super(bot, {
            name: 'cmdusages',
            description: 'Shows the most used commands',
            moduleID: 'core',
            aliases: ['usages']
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
        const commands = this.bot.statistics.getAllMostUsedCommands();
        if (!commands.length) return void ctx.send(`${DiscordEmoji.ERROR} **| No commands has been executed yet, wait a bit!**`);

        const content = [
            ['Command', 'Uses']
        ];

        for (const cmd of commands) content.push([cmd.key, `${cmd.uses.format()} Uses`]);

        return void ctx.code('prolog', table(content, this.tableConfig));
    }
}