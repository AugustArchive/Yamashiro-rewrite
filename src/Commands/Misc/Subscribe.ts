import { YamashiroClient, Command, Context } from '../../Structures';
import { DiscordEmoji } from '../../Utils/Constants';

export default class extends Command {
    constructor(bot: YamashiroClient) {
        super(bot, {
            name: 'subscribe',
            description: 'Subscribe to an self-assignable role',
            usage: '[id]',
            moduleID: 'misc',
            aliases: ['iam']
        });
    }

    async run(ctx: Context) {
        const settings = await this.bot.settings.get(ctx.guild.id);
        if (ctx.args.isEmpty(0)) {
            if (!settings.subscriptionRoles.length) return void ctx.send(`${DiscordEmoji.INFO} **| Admiral, no subscription roles hasn't been set by the guild administrators.**`);

            const embed = this.bot.getEmbed()
                .setAuthor(`| Subscription Roles in ${ctx.guild.name}:`, undefined, this.bot.avatar)
                .setDescription(settings.subscriptionRoles.map((roleID) => {
                    const role = ctx.guild.roles.get(roleID);
                    if (!role) return `Role was deleted from guild (\`${roleID}\`)`;
                    return `**${role.name}**: \`${ctx.prefix}subscribe ${roleID}\``;
                }).join('\n') || 'None')
                .build();
            return void ctx.embed(embed);
        } else {
            const roleID = ctx.args.get(0);
            const role   = ctx.guild.roles.get(roleID);
            if (!role) return void ctx.send(`${DiscordEmoji.ERROR} **| Role "${roleID}" doesn't exist in the guild. Weird...**`);
            if (!settings.subscriptionRoles.includes(roleID)) return void ctx.send(`${DiscordEmoji.ERROR} **| Role "${roleID}" doesn't exist in the list.**`);
            if (!ctx.self.permission.has('manageRoles')) return void ctx.send(`${DiscordEmoji.ERROR} **| I am unable to add roles to members. I need the \`Manage Roles\` permission. :/**`);
            if (ctx.member.roles.includes(role.id)) return void ctx.send(`${DiscordEmoji.ERROR} **| You already have the subscription role.**`);
            await ctx.member.addRole(role.id);
            return void ctx.send(`${DiscordEmoji.SUCCESS} **| Role "${role.name}" has been added to you, admiral.**`);
        }
    }
}