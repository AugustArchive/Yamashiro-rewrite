import { YamashiroClient, Command, Context } from '../../Structures';
import { stripIndents } from 'common-tags';
import { dateformat } from '@yamashiro/modules';

export default class extends Command {
    constructor(bot: YamashiroClient) {
        super(bot, {
            name: 'serverinfo',
            description: 'Shows information about the current guild',
            moduleID: 'util',
            guildOnly: true,
            aliases: ['sinfo', 'server', 'srv', 'ginfo', 'guild', 'guildinfo']
        });
    }

    get mutable() {
        return {
            regions: {
                'japan': '🇯🇵',
                'russia': '🇷🇺',
                'brazil': '🇧🇷',
                'london': '🇬🇧',
                'sydney': '🇦🇺',
                'eu-west': '🇪🇺',
                'us-west': '🇺🇸',
                'us-east': '🇺🇸',
                'us-south': '🇺🇸',
                'hongkong': '🇭🇰',
                'amsterdam': '🇳🇱',
                'singapore': '🇸🇬',
                'frankfurt': '🇩🇪',
                'us-central': '🇺🇸',
                'eu-central': '🇪🇺'
            },
            regionName: {
                'japan': 'Japan',
                'russia': 'Russia',
                'brazil': 'Brazil',
                'london': 'London',
                'sydney': 'Sydney',
                'eu-west': 'Western Europe',
                'us-west': 'US West',
                'us-east': 'US East',
                'us-south': 'US South',
                'hongkong': 'Hong Kong',
                'amsterdam': 'Amsterdam',
                'singapore': 'Singapore',
                'frankfurt': 'Frankfurt',
                'us-central': 'US Central',
                'eu-central': 'EU Central'
            }
        };
    }

    async run(ctx: Context) {
        const guild = await this.bot.rest.getGuild(ctx.guild.id);
        const owner = this.bot.users.get(guild.ownerID)!;

        let nextTier = 0;
        switch (guild.premiumTier) {
            case 0: nextTier = 2 - guild.premiumSubscriptionCount!; break;
            case 1: nextTier = 15 - guild.premiumSubscriptionCount!; break;
            case 2: nextTier = 30 - guild.premiumSubscriptionCount!; break;
            default: break;
        }

        const embed = this.bot.getEmbed()
            .setAuthor(`| Guild ${guild.name}`, undefined, this.bot.avatar)
            .setThumbnail(guild.icon? guild.iconURL!: this.bot.avatar)
            .setDescription(guild.description? guild.description.elipisis(1000): 'Not illegable for a description (**Needs to be a tier 3 server**)')
            .addField('Guild ID', guild.id, true)
            .addField('Created At', dateformat(guild.createdAt, 'mm/dd/yyyy hh:MM:ss TT'), true)
            .addField('Vanity URL', guild.vanityURL? `https://discord.gg/${guild.vanityURL}`: guild.premiumTier === 3? 'Hasn\'t been set': 'Needs to be a Tier 3 server', true)
            .addField(`${this.mutable.regions[guild.region]} Region`, this.mutable.regionName[guild.region], true)
            .addField(`Boosts [Tier ${guild.premiumTier}/3]`, `**${guild.premiumSubscriptionCount || 'No'}** boosters (${guild.premiumTier === 4? 'Max Tier reached.': nextTier === 0? 'Guild doesn\'t have any boosters.': `**${nextTier}** left to Tier ${guild.premiumTier + 1}`})`, true)
            .addField('Owner', owner.tag, true)
            .addField(`Channels [${guild.channels.size}]`, stripIndents`
                • **Text**: ${guild.channels.filter(s => s.type === 0).length.format()}
                • **Voice**: ${guild.channels.filter(s => s.type === 2).length.format()}
                • **Categories**: ${guild.channels.filter(s => s.type === 4).length.format()}
            `, true)
            .addField(`Members [${guild.memberCount}]`, stripIndents`
                • **Online**: ${guild.members.filter(s => s.status === 'online').length.format()}
                • **Offline**: ${guild.members.filter(s => s.status === 'offline').length.format()}
                • **Humans/Bots**: ${guild.members.filter(s => !s.bot).length}/${guild.members.filter(s => s.bot).length}
            `, true);
        return void ctx.embed(embed.build());
    }
}