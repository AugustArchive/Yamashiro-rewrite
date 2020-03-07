import { YamashiroClient, Command, Context } from '../../Structures';
import { DiscordEmoji, SUPPORT_SERVER } from '../../Utils/Constants';
import { stripIndents } from 'common-tags';

export default class extends Command {
    constructor(bot: YamashiroClient) {
        super(bot, {
            name: 'help',
            description: 'Shows documentation on a command or gives a full list of Yamashiro\'s commands',
            moduleID: 'core',
            aliases: ['halp', 'h', 'cmds', 'commands', 'command'],
            guarded: true
        });
    }

    async run(ctx: Context) {
        if (ctx.args.isEmpty(0)) {
            const embed = this.bot.getEmbed()
                .setAuthor(`| ${this.bot.user.tag} - Commands List`, 'https://shipgirl.augu.dev/commands', this.bot.avatar)
                .setThumbnail(this.bot.avatar)
                .setFooter(`${this.bot.manager.commands.size} Commands // ${this.bot.manager.modules.size} Modules`)
                .setDescription(stripIndents`
                    Use **\`${ctx.prefix}help <command|module>\`** to get documentation on a command or module.
                    **[Server](${SUPPORT_SERVER})** | **[Upvote](https://discord.boats/bot/yamashiro)**
                `);

            for (const module of this.bot.manager.modules.values()) {
                if (module.name === 'system') continue;
                embed.addField(`${module.emoji} **${module.name.captialize()}**`, module.commands.filter(s => !s.disabled).map(s => `**\`${s.name}\`**`).join(' | ') || 'None', false);
            }

            return void ctx.embed(embed.build());
        } else {
            const name = ctx.args.get(0);
            const cmdOrMod = this.bot.manager.commands.filter((cmd) =>
                cmd.module.name !== 'system' && cmd.name === name || cmd.aliases.includes(name)
            );

            if (cmdOrMod.length) {
                const c = cmdOrMod[0];
                const h = c.help();
                return void ctx.embed(h);
            } else {
                const _module = this.bot.manager.modules.filter((mod) =>
                    mod.name !== 'system' && mod.name === name
                );

                if (_module.length) {
                    const mod = _module[0];
                    const hel = mod.help();
                    return void ctx.embed(hel);
                } else {
                    return void ctx.send(`${DiscordEmoji.ERROR} **| Command or module \`${name}\` doesn't exist.**`);
                }
            }
        }
    }
}