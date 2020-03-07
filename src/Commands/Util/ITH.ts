import { YamashiroClient, Command, Context } from '../../Structures';
import { DiscordEmoji } from '../../Utils/Constants';

export default class extends Command {
    constructor(bot: YamashiroClient) {
        super(bot, {
            name: 'ith',
            description: 'Converts an integer to a hexadecimal',
            moduleID: 'util',
            usage: '<int>'
        });
    }

    async run(ctx: Context) {
        if (ctx.args.isEmpty(0)) return void ctx.send(`${DiscordEmoji.ERROR} **| No integer was provided.**`);

        const int = ctx.args.get(0);
        const hex = parseInt(int.replace('#', '')).toString(16);

        return void ctx.embed(
            this
                .bot
                .getEmbed()
                .setAuthor('| Result from Integer -> Hexadecimal', undefined, this.bot.avatar)
                .setDescription(`**${int}** -> **#${hex}**`)
                .build()
        );
    }
}