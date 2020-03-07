import { YamashiroClient, Command, Context } from '../../Structures';
import { stripIndents } from 'common-tags';
import { Colors } from '../../Utils/Constants';

export default class extends Command {
    constructor(bot: YamashiroClient) {
        super(bot, {
            name: 'donate',
            description: 'Shows information on how to donate to me~',
            moduleID: 'core',
            aliases: ['patreon']
        });
    }

    async run(ctx: Context) {
        const embed = this.bot.getEmbed()
            .setAuthor('| Donate on Patreon', 'https://patreon.com/auguwu', this.bot.avatar)
            .setColor(Colors.PATREON)
            .setDescription(stripIndents`
                H-hello! I just wanted to say that if you like,
                you can donate to my Patreon page. This is optional and I don't like to paywall you,
                so this is just for people who want more benefits to the bot.

                <https://patreon.com/auguwu>
                **If you have cancelled your purchase (at the end of the month) without a valid reason, you will get blacklisted from the bot.**
            `)
            .build();

        return void ctx.embed(embed);
    }
}