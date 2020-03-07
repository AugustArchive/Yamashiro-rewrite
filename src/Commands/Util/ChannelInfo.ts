import { YamashiroClient, Command, Context } from '../../Structures';
import { VoiceChannel, TextChannel } from 'eris';
import { dateformat } from '@yamashiro/modules';

export default class extends Command {
    constructor(bot: YamashiroClient) {
        super(bot, {
            name: 'channelinfo',
            description: 'Gets information on a channel',
            usage: '[channel]',
            moduleID: 'util',
            aliases: ['channel', 'chan', 'cinfo', 'chaninfo'],
            guildOnly: true
        });
    }

    get chanTypes() {
        return {
            0: 'Text',
            1: 'DM',
            2: 'Voice',
            3: 'Group',
            4: 'Category',
            5: 'News',
            6: 'Store'
        };
    }

    async run(ctx: Context) {
        const channelID = ctx.args.isEmpty(0)? ctx.channel.id: ctx.args.join(' ');
        const channel = await this.bot.rest.getChannel(channelID, ctx.guild);

        const embed = this.bot.getEmbed()
            .setAuthor(`| Channel ${channel.type === 0? `#${channel.name}`: channel.name}`, undefined, this.bot.avatar)
            .addField('Channel ID', channel.id, true)
            .addField('Channel Type', this.chanTypes[channel.type], true)
            .addField('Created At', dateformat(channel.createdAt, 'mm/dd/yyyy hh:MM:ss TT'), true);

        if (channel.type === 0) {
            const topic = (channel as TextChannel).topic? (channel as TextChannel).topic!.elipisis(1350): 'None was provided';
            embed.addField('NSFW', (channel as TextChannel).nsfw? 'Yes': 'No', true);
            embed.addField('Topic', topic, true);
        }

        if (!ctx.guild || !ctx.guild.channels.has(channel.id)) {
            const guild = this.bot.guilds.get(this.bot.channelGuildMap[channel.id])!;
            embed.addField('Guild', `**${guild.name}** (\`${guild.id}\`)`, true);
        }

        if (channel.type !== 4 && channel.parentID) {
            const category = channel.guild.channels.get(channel.parentID)!;
            embed.addField('Category', category.name, true);
        }

        if (channel.type === 2) {
            embed.addField('Users Connected', (channel as VoiceChannel).voiceMembers!.size.format(), true);
            embed.addField('User Limit', (channel as VoiceChannel).userLimit!.format(), true);
        }

        return void ctx.embed(embed.build());
    }
}