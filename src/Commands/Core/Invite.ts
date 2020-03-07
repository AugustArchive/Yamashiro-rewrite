import { YamashiroClient, Command, Context } from '../../Structures';
import { SUPPORT_SERVER } from '../../Utils/Constants';
import { stripIndents } from 'common-tags';

export default class extends Command {
    constructor(bot: YamashiroClient) {
        super(bot, {
            name: 'invite',
            description: 'Grabs the invitation url for Yamashiro and her discord server.',
            moduleID: 'core',
            aliases: ['inv', 'inviteme'],
            guarded: true
        });
    }

    async run(ctx: Context) {
        return void ctx.send(stripIndents`
            :pencil: **| Here you go, ${ctx.sender.username}-senpai~**
            Invitation: <${this.bot.invite}>
            Discord Server: <${SUPPORT_SERVER}>
        `);
    }
}