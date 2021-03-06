import { YamashiroClient, Command, Context } from '../../Structures';
import { DiscordEmoji } from '../../Utils/Constants';
import { get } from 'wumpfetch';

interface Response {
    source: string;
    data: string;
}
export default class extends Command {
    constructor(bot: YamashiroClient) {
        super(bot, {
            name: 'nature',
            description: 'Shows a random photo of Nature',
            moduleID: 'images'
        });
    }

    async run(ctx: Context) {
        if (!this.bot.config.apis.chewey) return void ctx.send(`${DiscordEmoji.ERROR} **| Unable to fetch from Chewey Bot API without an API key.**`);

        try {
            const res = await get(`https://api.chewey-bot.ga/nature?auth=${this.bot.config.apis.chewey}`).send();
            const info = res.json<Response>();

            const embed = this.bot.getEmbed()
                .setTitle('Nature is so pretty...')
                .setImage(info.data)
                .setFooter('Powered by api.chewey-bot.ga');

            return void ctx.embed(embed.build());
        } catch {
            return void ctx.send(`${DiscordEmoji.ERROR} **| Unable to get a random photo of Nature.**`);
        }
    }
}