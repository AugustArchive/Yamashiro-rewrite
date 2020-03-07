import { YamashiroClient, Command, Context } from '..';
import { DiscordEmoji, Colors } from '../../Utils/Constants';
import { get } from 'wumpfetch';

interface Response {
    url: string;
}
export default class DerpyCommand extends Command {
    constructor(bot: YamashiroClient, name: string) {
        super(bot, {
            name,
            description: `Grabs a random image of ${name.captialize()}`,
            moduleID: 'weeb'
        });
    }

    async run(ctx: Context) {
        try {
            const name = this.name === 'k-on'? 'k_on': this.name;
            const result = await get(`https://miku.derpyenterprises.org/${name}json`)
                .send();

            const res = result.json<Response>();
            return void ctx.embed(
                this
                    .bot
                    .getEmbed()
                    .setColor(Colors.DERPY)
                    .setImage(res.url)
                    .setFooter('Powered by miku.derpyenterprises.org', 'https://is-gonna-to-rickroll.me/api/image/user/145557815287611393' || 'https://derpyenterprises.org/assets/img/icon.gif')
                    .build()
            );
        } catch {
            return void ctx.send(`${DiscordEmoji.HUH} **| Unable to get a random image of ${this.name.captialize()}**`);
        } 
    }
}