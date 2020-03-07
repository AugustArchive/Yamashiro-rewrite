import { YamashiroClient, Command, Context } from '../../Structures';
import { DiscordEmoji } from '../../Utils/Constants';

export default class extends Command {
    constructor(bot: YamashiroClient) {
        super(bot, {
            name: 'unsubscribe',
            description: 'Unsubsribe from a role',
            moduleID: 'misc',
            usage: '<roleID>',
            aliases: ['iamnot']
        });
    }

    async run(ctx: Context) {
        if (ctx.args.isEmpty(0)) return void ctx.send(`${DiscordEmoji.ERROR} **| You haven't added the \`roleID\` argument, admiral**`);

        const roleID = ctx.args.get(0);
        const role   = ctx.guild.roles.get(roleID);
        if (!role) return void ctx.send(`${DiscordEmoji.ERROR} **| No role by the id "${roleID}" has not been found.**`);
        if (!ctx.member.roles.includes(role.id)) return void ctx.send(`${DiscordEmoji.ERROR} **| You don't the role "${role.name}"**`);
        if (!ctx.self.permission.has('manageRoles')) return void ctx.send(`${DiscordEmoji.ERROR} **| I am unable to remove the self assignable role. I need the \`Manage Roles\` permission. :/**`);
        
        await ctx.member.removeRole(role.id);
        return void ctx.send(`${DiscordEmoji.SUCCESS} **| Role "${role.name}" has been removed, admiral~**`);
    }
}