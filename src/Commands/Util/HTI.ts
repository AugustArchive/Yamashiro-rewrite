import { YamashiroClient, Command, Context } from '../../Structures';
import { DiscordEmoji } from '../../Utils/Constants';

export default class extends Command {
    constructor(bot: YamashiroClient) {
        super(bot, {
            name: 'hti',
            description: 'Converts a hexadecimal to an integer',
            usage: '<#hex>',
            moduleID: 'util'
        });
    }

    async run(ctx: Context) {
        if (ctx.args.isEmpty(0)) return void ctx.send(`${DiscordEmoji.ERROR} **| No hexadecimal was provided.**`);

        //* Replace the "#" so it won't be in the process of converting
        const hex = ctx.args.get(0).replace('#', '');
        const int = parseInt(hex, 16);

        return void ctx.embed(
            this
                .bot
                .getEmbed()
                .setAuthor('| Result from Hexadecimal -> Integer', undefined, this.bot.avatar)
                .setDescription(`**#${hex}** -> **${int}**`)
                .setColor(int)
                .build()
        );
    }
}