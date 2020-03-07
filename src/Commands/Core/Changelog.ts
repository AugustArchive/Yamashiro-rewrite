import { YamashiroClient, Command, Context } from '../../Structures';
import { TextChannel } from 'eris';
import { dateformat } from '@yamashiro/modules';

export default class extends Command {
    constructor(bot: YamashiroClient) {
        super(bot, {
            name: 'changelog',
            description: 'Checks the #changelog channel in my community.',
            moduleID: 'core',
            aliases: ['changes'],
            guarded: true
        });
    }

    async run(ctx: Context) {
        const guild = this.bot.guilds.get('382725233695522816')!;
        const msgs  = await (guild.channels.get('605210962600919040')! as TextChannel).getMessages(5);
        return void ctx.embed(
            this
                .bot
                .getEmbed()
                .setAuthor('| Changelog', undefined, this.bot.avatar)
                .setDescription(msgs[0].content)
                .setFooter(`Posted At: ${dateformat(msgs[0].createdAt, 'mm/dd/yyyy hh:MM:ss TT')}`)
                .build()
        );
    }
}