import { YamashiroClient, Command, Context } from '../../Structures';
import { DiscordEmoji } from '../../Utils/Constants';

export default class extends Command {
    constructor(bot: YamashiroClient) {
        super(bot, {
            name: 'disable',
            description: 'Disables a command or module in the guild',
            usage: '<"command"/"cmd"/"c" | "module"/"mod"/"m"> <cmdOrMod>',
            moduleID: 'misc',
            aliases: ['disable-mod', 'disable-cmd'],
            guarded: true
        });
    }

    async run(ctx: Context) {
        const subcommand = ctx.args.get(0);
        const settings   = await this.bot.settings.get(ctx.guild.id);

        if (!this.bot.admins.includes(ctx.sender.id) && !ctx.member.permission.has('manageGuild')) return void ctx.send(`${DiscordEmoji.ERROR} **| You need the \`Manage Guild\` permission to disable commands.**`);
        switch (subcommand) {
            case 'command':
            case 'cmd':
            case 'c': {
                if (ctx.args.isEmpty(1)) return void ctx.send(`${DiscordEmoji.ERROR} **| No command name was provided.**`);

                const name = ctx.args.get(1);
                const cmds = this.bot.manager.commands.filter((cmd) =>
                    cmd.name === name
                );

                if (!cmds.length) return void ctx.send(`${DiscordEmoji.ERROR} **| No command by "${name}" was found.**`);
                if (settings.disabledCommands.includes(cmds[0].name)) return void ctx.send(`${DiscordEmoji.ERROR} **| Command "${cmds[0].name}" is already disabled.**`);
                if (cmds[0].guarded) return void ctx.send(`${DiscordEmoji.ERROR} **| The command "${cmds[0].name}" cannot be disabled.**`);

                settings.disabledCommands.push(cmds[0].name);
                await settings.save();
                return void ctx.send(`${DiscordEmoji.OK} **| Command "${cmds[0].name}" has been disabled in ${ctx.guild.name}.**`);
            }

            case 'module':
            case 'mod':
            case 'm': {
                if (ctx.args.isEmpty(1)) return void ctx.send(`${DiscordEmoji.ERROR} **| No module name was provided.**`);

                const name = ctx.args.get(1);
                const mods = this.bot.manager.modules.filter((mod) =>
                    mod.name === name
                );

                if (!mods.length) return void ctx.send(`${DiscordEmoji.ERROR} **| Module "${name}" was not found.**`);
                if (settings.disabledModules.includes(mods[0].name)) return void ctx.send(`${DiscordEmoji.ERROR} **| Module "${mods[0].name}" is already disabled.**`);
                if (['core', 'misc'].includes(mods[0].name)) return void ctx.send(`${DiscordEmoji.ERROR} **| Cannot disable the ${mods[0].name.captialize()} module.**`);

                settings.disabledModules.push(mods[0].name);
                await settings.save();
                return void ctx.send(`${DiscordEmoji.SUCCESS} **| Module "${mods[0].name}" has been disabled in ${ctx.guild.name}. Showing what commands are now disabled:**`, this.bot.getEmbed()
                    .setAuthor('| Disabled Commands List', undefined, this.bot.avatar)
                    .setDescription(mods[0].commands.map(s => `**${settings.prefix}${s.name}**`).join('\n'))
                    .build()
                );
            }

            default: return void ctx.send(`${DiscordEmoji.ERROR} **| ${subcommand === undefined? 'No subcommand was provided.': 'Invalid subcommand.'}**`);
        }
    }
}