import { YamashiroClient, Command, Context } from '../../Structures';
import { DiscordEmoji } from '../../Utils/Constants';

export default class extends Command {
    constructor(bot: YamashiroClient) {
        super(bot, {
            name: 'enable',
            description: 'Enables a command or module in the guild',
            usage: '<"command"/"cmd"/"c" | "module"/"mod"/"m"> <cmdOrMod>',
            moduleID: 'misc',
            aliases: ['enable-mod', 'enable-cmd'],
            guarded: true
        });
    }

    async run(ctx: Context) {
        const subcommand = ctx.args.get(0);
        const settings   = await this.bot.settings.get(ctx.guild.id);

        if (!this.bot.admins.includes(ctx.sender.id) && !ctx.member.permission.has('manageGuild')) return void ctx.send(`${DiscordEmoji.ERROR} **| You need the \`Manage Guild\` permission to re-enable commands.**`);
        switch (subcommand) {
            case 'command':
            case 'cmd':
            case 'c': {
                if (ctx.args.isEmpty(1)) return void ctx.send(`${DiscordEmoji.ERROR} **| No command name was provided.**`);

                const name = ctx.args.get(1);
                const cmds = this.bot.manager.commands.filter((cmd) =>
                    cmd.name === name
                );

                if (!cmds.length) return void ctx.send(`${DiscordEmoji.ERROR} **| No command by "${name}" was not found.**`);
                if (!settings.disabledCommands.includes(cmds[0].name)) return void ctx.send(`${DiscordEmoji.ERROR} **| Command "${cmds[0].name}" is already enabled...**`);

                settings.disabledCommands.remove(cmds[0].name);
                await settings.save();
                return void ctx.send(`${DiscordEmoji.OK} **| Command "${cmds[0].name}" has been enabled in ${ctx.guild.name}.**`);
            }

            case 'module':
            case 'mod':
            case 'm': {
                if (ctx.args.isEmpty(1)) return void ctx.send(`${DiscordEmoji.ERROR} **| No module name was provided**`);
        
                const name = ctx.args.get(1);
                const mods = this.bot.manager.modules.filter((mod) =>
                    mod.name === name
                );

                if (!mods.length) return void ctx.send(`${DiscordEmoji.ERROR} **| No module by "${name}" was not found.**`);
                if (!settings.disabledModules.includes(mods[0].name)) return void ctx.send(`${DiscordEmoji.ERROR} **| Module "${mods[0].name}" is already enabled.**`);

                settings.disabledModules.remove(mods[0].name);
                await settings.save();
                return void ctx.send(`${DiscordEmoji.OK} **| Module "${mods[0].name}" is enabled in ${ctx.guild.name}. All ${mods[0].commands.size} commands are now usuable!**`);
            }

            default: return void ctx.send(`${DiscordEmoji.ERROR} **| ${subcommand === undefined? 'No subcommand was provided.': 'Invalid subcommand.'}**`);
        }
    }
}