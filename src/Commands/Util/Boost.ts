import { YamashiroClient, Command, Context } from '../../Structures';
import { DiscordEmoji } from '../../Utils/Constants';

export default class extends Command {
    constructor(bot: YamashiroClient) {
        super(bot, {
            name: 'boosts',
            description: 'Shows information on all boosters',
            moduleID: 'util',
            aliases: ['boost', 'boosters']
        });
    }

    async run(ctx: Context) {
        const members = ctx.guild.members.filter(m => m.premiumSince != null);
        if (!members.length) return void ctx.send(`${DiscordEmoji.ERROR} **| Cannot list boosters due to no boosters in here.**`);
        if (ctx.guild.premiumTier === 0) return void ctx.send(`${DiscordEmoji.ERROR} **| Cannot list boosters due to the guild being tier 0**`);

        const embed = this.bot.getEmbed()
            .setAuthor(`| Boosters for ${ctx.guild.name} [${ctx.guild.premiumTier}/3]`, undefined, ctx.guild.icon? ctx.guild.iconURL!: this.bot.avatar)
            .setThumbnail(ctx.guild.icon? ctx.guild.iconURL!: this.bot.avatar)
            .setDescription(members.map(s => `• **${s.tag}**`).join('\n'))
            .build();

        return void ctx.embed(embed);
    }
}