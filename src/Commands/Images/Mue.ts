import { YamashiroClient, Command, Context } from '../../Structures';
import { DiscordEmoji, Colors } from '../../Utils/Constants';
import { stripIndents } from 'common-tags';
import { get } from 'wumpfetch';

interface MueResponse {
    photographer: string;
    location: string;
    category: string;
    file: string;
    id: number;
}

export default class extends Command {
    constructor(bot: YamashiroClient) {
        super(bot, {
            name: 'mue',
            description: 'Grabs a random photograph from Mue\'s API',
            moduleID: 'images'
        });
    }

    async run(ctx: Context) {
        try {
            const result = await get('https://api.muetab.xyz/getImage?category=Outdoors').send();
            const res = result.json<MueResponse>();

            const embed = this.bot.getEmbed()
                .setColor(Colors.DERPY)
                .setDescription(stripIndents`
                    :pushpin: **${res.location}**
                    :camera: **${res.photographer}**
                `)
                .setImage(res.file)
                .setFooter('Powered by api.muetab.xyz')
                .build();

            return void ctx.embed(embed);
        } catch {
            return void ctx.send(`${DiscordEmoji.ERROR} **| Unable to fetch a photo?**`);
        }
    }
}