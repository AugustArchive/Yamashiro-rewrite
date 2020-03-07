import { YamashiroClient, Command, Context } from '../../Structures';
import { VoiceChannel } from 'eris';
import { stripIndents } from 'common-tags';
import { dateformat } from '@yamashiro/modules';

export default class extends Command {
    constructor(bot: YamashiroClient) {
        super(bot, {
            name: 'userinfo',
            description: 'Grabs information on a user in the guild',
            usage: '[user]',
            moduleID: 'util',
            aliases: ['user', 'uinfo', 'ui']
        });
    }

    async run(ctx: Context) {
        const userID = ctx.args.isEmpty(0)? ctx.sender.id: ctx.args.join(' ');
        const user   = await this.bot.rest.getUser(userID);

        const embed = this.bot.getEmbed()
            .setAuthor(`| User ${user.tag}`, undefined, user.avatarURL || user.defaultAvatarURL)
            .setThumbnail(user.avatarURL || user.defaultAvatarURL)
            .addField('User ID', user.id, true)
            .addField('Created At', dateformat(user.createdAt, 'mm/dd/yyyy hh:MM:ss TT'), true)
            .addField('Bot', user.bot? 'Yes': 'No', true);

        //* Checks to see if the user is in a guild and
        //* if the member exists (idk it's called cache)
        if (ctx.guild && ctx.guild.members.has(user.id)) {
            const member = ctx.guild.members.get(user.id)!;
            if (member.nick) embed.addField('Nickname', member.nick || 'None', true);

            embed
                .addField('Current Status', member.status === 'online'? '<:online:457289010037915660> **Online**': member.status === 'idle'? '<:away:457289009912217612> **Away**': member.status === 'dnd'? '<:dnd:457289032330772502> **Do not Disturb**': '<:offline:457289010084184066> **Offline**', true)
                .addField('Joined At', dateformat(member.joinedAt, 'mm/dd/yyyy hh:MM:ss TT'), true);

            if (member.game) {
                const _send = (
                    member.game.type === 0? 'Playing':
                        member.game.type === 1? 'Streaming':
                            member.game.type === 2? 'Listening to':
                                member.game.type === 3? 'Watching': ''
                );

                const cust = member.game.type === 4? `Custom Status\n**${member.game.state}**`: '';
                const rich = member.game.name !== 'Spotify'? `${member.game.name}\n• **${member.game.state}**\n• **${member.game.details}**`: '';
                const spot = member.game.name === 'Spotify'? `Spotify (${member.game.state} - ${member.game.details})`: cust !== ''? cust: rich !== ''? rich: '';
                embed.setDescription(`${_send !== ''? `**${_send}** `: ''}${member.game.type === 1? `[${member.game.name}](${member.game.url})`: spot}`);
            }

            if (!user.bot && member.premiumSince != null) embed.addField('Boosting Info', stripIndents`
                • **Boosting**: ${member.premiumSince? 'Yes': 'No'}
                • **Since**: ${member.premiumSince? dateformat(member.premiumSince, 'mm/dd/yyyy hh:MM:ss TT'): '---'}
            `, true);

            if (member.voiceState.channelID && ctx.guild.channels.has(member.voiceState.channelID)) {
                const voice = (<VoiceChannel> ctx.guild.channels.get(member.voiceState.channelID)!);
                embed.addField(`Voice Channel [${voice.voiceMembers!.size}]`, stripIndents`
                    • **Channel**: ${voice.name} (\`${voice.id}\`)
                    • **Muted**: ${member.voiceState.mute || member.voiceState.selfMute? 'Yes': 'No'}
                    • **Deafened**: ${member.voiceState.deaf || member.voiceState.selfDeaf? 'Yes': 'No'}
                `, true);
            }
        }

        return void ctx.embed(embed.build());
    }
}