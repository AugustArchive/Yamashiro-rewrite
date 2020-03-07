import { YamashiroClient, Command, Context } from '..';
import { DiscordEmoji, Colors } from '../../Utils/Constants';
import { get } from 'wumpfetch';

interface Response {
    url: string;
    creator: string; //* not used since it's usually blank
}
export default class MeekCommand extends Command {
    constructor(bot: YamashiroClient, name: string) {
        super(bot, {
            name,
            description: `Grabs a random image of ${name.captialize()}`,
            moduleID: 'weeb'
        });
    }

    async run(ctx: Context) {
        try {
            const result = await get(`https://api.meek.moe/${this.name}`)
                .send();

            const res = result.json<Response>();
            return void ctx.embed(
                this
                    .bot
                    .getEmbed()
                    .setColor(Colors.SPEY)
                    .setImage(res.url)
                    .setFooter('Powered by meek.moe', 'https://is-gonna-to-rickroll.me/api/image/user/174970757468651520' || this.bot.avatar)
                    .build()
            );
        } catch {
            return void ctx.send(`${DiscordEmoji.HUH} **| Unable to get a random image of ${this.name.captialize()}**`);
        } 
    }
}