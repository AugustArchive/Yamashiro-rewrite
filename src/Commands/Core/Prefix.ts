import { YamashiroClient, Command, Context } from '../../Structures';
import { DiscordEmoji } from '../../Utils/Constants';

export default class extends Command {
    constructor(bot: YamashiroClient) {
        super(bot, {
            name: 'prefix',
            description: 'Shows the current prefix or changes the guild\'s prefix',
            moduleID: 'core',
            guildOnly: true,
            guarded: true,
            usage: '[prefix | "reset"]'
        });
    }

    async run(ctx: Context) {
        const settings = await this.bot.settings.get(ctx.guild.id);
        if (ctx.args.isEmpty(0)) return void ctx.send(`${DiscordEmoji.INFO} **| The current guild prefix is \`${settings.prefix}\`. \`${this.bot.config.discord.prefix}\` and mentioning me also works as prefixes.**`);
        if (!this.bot.admins.includes(ctx.sender.id) && !ctx.member.permission.has('manageGuild')) return void ctx.send(`${DiscordEmoji.ERROR} **| You must need the \`Manage Guild\` permission to change the guild prefix.**`);

        let prefix = ctx.args.get(0);
        if (prefix.length > 15) return void ctx.send(`${DiscordEmoji.ERROR} **| The prefix length cannot be longer then 15 characters.**`);
        if (['@everyone', '@here'].includes(prefix)) return void ctx.send(`${DiscordEmoji.ERROR} **| Are you dumb? You cannot set at everyone or here pings... I think your members are pissed...**`);
        if (settings.prefix === prefix) return void ctx.send(`${DiscordEmoji.ERROR} **| The new prefix (${prefix}) is the same as the guild prefix.**`);
        if (prefix === 'reset') {
            await this.bot.settings.update(ctx.guild.id, {
                $set: {
                    'prefix': this.bot.config.discord.prefix
                }
            });

            return void ctx.send(`${DiscordEmoji.INFO} **| Prefix has been reset to \`${this.bot.config.discord.prefix}\`**`);
        }

        await this.bot.settings.update(ctx.guild.id, {
            $set: {
                'prefix': prefix
            }
        });
        return void ctx.send(`${DiscordEmoji.INFO} **| The prefix has been changed to "${prefix}"**`);
    }
}