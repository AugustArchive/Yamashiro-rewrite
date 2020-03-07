import { DiscordEvent, ActivityStatus, ActivityType } from '../Utils/Constants';
import { YamashiroClient, Event } from '../Structures';
import { dateformat } from '@yamashiro/modules';
import { Guild } from 'eris';

export default class extends Event {
    constructor(bot: YamashiroClient) {
        super(bot, DiscordEvent.GUILD_JOINED);
    }

    async emit(guild: Guild) {
        this.bot.prometheus.guildCount.inc();
        this.bot.logger.info(`Joined ${guild.name} (${guild.id})`);
        this.bot.settings.create(guild.id);

        //* Edit the status
        this.bot.editStatus(ActivityStatus.ONLINE, {
            name: `${this.bot.config.discord.prefix}help | ${this.bot.guilds.size.toLocaleString()} Guilds`,
            type: ActivityType.PLAYING
        });
        
        //* Webhook Stuff
        const bots   = Math.round((guild.members.filter(v => v.user.bot).length / guild.memberCount) * 100);
        const isFarm = bots >= 0.65;
        const owner  = this.bot.users.get(guild.ownerID)!;
        const embed  = this.bot.getEmbed()
            .setAuthor(`| Guild ${guild.name} (${guild.id})`, undefined, guild.icon? guild.iconURL: this.bot.avatar)
            .setThumbnail(guild.icon? guild.iconURL!: this.bot.avatar)
            .setDescription(isFarm? ':warning: **Guild is a bot list. Be cautious!**': 'No red flags here!')
            .addField('ID', guild.id, true)
            .addField('Created At', dateformat(guild.createdAt, 'mm/dd/yyyy hh:MM:ss TT'), true)
            .addField('Owner', `${owner.tag} (${guild.ownerID})`, true)
            .addField(`Members [${guild.memberCount}]`, `**${guild.members.filter(g => g.user.bot).length} Bots** | **${guild.members.filter(g => !g.user.bot).length} Humans**`, true)
            .addField(`Channels [${guild.channels.size}]`, `**${guild.channels.filter(c => c.type === 0).length} Text** | **${guild.channels.filter(c => c.type === 2).length} Voice**`, true)
            .build();

        this.bot.webhook.send(`<:menhera_love:612218832232120321> **| Joined ${guild.name}!**`, embed);
    }
}