import { YamashiroClient, Command, Context } from '../../Structures';
import { DiscordEmoji } from '../../Utils/Constants';

export default class extends Command {
    constructor(bot: YamashiroClient) {
        super(bot, {
            name: 'hex-rgb',
            description: 'Converts a hexadecimal to RGB values',
            usage: '<#hex>',
            moduleID: 'util',
            aliases: ['hrgb']
        });
    }

    async run(ctx: Context) {
        if (ctx.args.isEmpty(0)) return void ctx.send(`${DiscordEmoji.ERROR} **| Admiral, you are missing the \`hex\` argument.**`);

        const _hex = ctx.args.get(0);
        const hex  = _hex.startsWith('#')? _hex: `#${_hex}`;
        const rgb  = this.hexToRGB(hex);
        if (rgb === null) return void ctx.send(`${DiscordEmoji.ERROR} **| Unable to parse \`${_hex}\`.**`);

        return void ctx.embed(
            this
                .bot
                .getEmbed()
                .setAuthor('| Result from Hexadecimal -> RGB', undefined, this.bot.avatar)
                .setDescription(`**${hex}** -> **[${rgb[0]}, ${rgb[1]}, ${rgb[2]}]**`)
                .build()
        );
    }

    //* credit: https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
    hexToRGB(hex: string): [number, number, number] | null {
        const regex = (/^#?([a-f\d])([a-f\d])([a-f\d])$/i);
        hex = hex.replace(regex, (_, r, g, b) => r + r + g + g + b + b);
        const result = (/^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i).exec(hex);
        return result? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]: null;
    }
}