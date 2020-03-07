import { YamashiroClient, Command, Context } from '../../Structures';
import { captureException } from '@sentry/node';
import { DiscordEmoji } from '../../Utils/Constants';
import { get } from 'wumpfetch';

interface CarbonBot {
    servercount: number;
    compliant: number;
    name: string;
}
export default class extends Command {
    constructor(bot: YamashiroClient) {
        super(bot, {
            name: 'botlist',
            description: 'Gets the top bots from Carbon and top.gg',
            usage: '[page]',
            moduleID: 'util',
            aliases: ['bots']
        });
    }

    async run(ctx: Context) {
        const data = await this.getCarbonBots();
        if (data === null) return void ctx.send(`${DiscordEmoji.HUH} **| Unable to fetch statistics. Try again later.**`);

        let curr = ctx.args.get(0);
        let page = 1;

        //* sort the data to be uwuified
        data.sort((a, b) =>
            Number(a.servercount) === Number(b.servercount)? 0: +(Number(a.servercount) < Number(b.servercount)) || -1
        );

        if (curr && !isNaN(Number(curr))) page = Number(curr);
        else page = 1;

        if (data[(page - 1) * 10]) {
            const embed = this
                .bot
                .getEmbed()
                .setAuthor('| Carbonitex Bot List', undefined, this.bot.avatar)
                .setFooter(`Page ${page}/${Math.ceil(data.length / 10)}`);

            let content = '';
            let limit   = 0;

            if (data[((page - 1) * 10) + 10]) limit = ((page - 1) * 10) + 10;
            else limit = data.length;

            for (let i = ((page - 1) * 10); i < limit; i++) {
                const compliant = data[i].compliant === 1? '(Compliant)': '';
                content += `${i + 1}. ${data[i].name} - ${Number(data[i].servercount).format()} Servers ${compliant}\n`;
            }

            embed.setDescription(`\`\`\`apache\n${content}\`\`\``);
            return void ctx.embed(embed.build());
        }
    }

    async getCarbonBots() {
        try {
            const result = await get('https://www.carbonitex.net/discord/api/listedbots').send();
            return result.json<CarbonBot[]>();
        } catch(ex) {
            this.bot.logger.error(`Unable to pull stats from Carbontiex:\n${ex}`);
            captureException(ex);
            return null;
        }
    }
}