import { YamashiroClient, Command, Context } from '../../Structures';
import { humanize, dateformat } from '@yamashiro/modules';
import { DiscordEmoji } from '../../Utils/Constants';

export default class extends Command {
    constructor(bot: YamashiroClient) {
        super(bot, {
            name: 'uptime',
            description: 'Shows how long Yamashiro is up for',
            moduleID: 'core',
            aliases: ['upfor']
        });
    }

    async run(ctx: Context) {
        return void ctx.send(`${DiscordEmoji.INFO} **| ${humanize(Date.now() - this.bot.startTime, { long: true })} (${dateformat(this.bot.startTime, 'mm/dd/yyyy hh:MM:ss TT')})**`);
    }
}