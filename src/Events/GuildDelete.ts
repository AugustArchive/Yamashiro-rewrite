import { DiscordEvent, ActivityStatus, ActivityType } from '../Utils/Constants';
import { YamashiroClient, Event } from '../Structures';
import { dateformat } from '@yamashiro/modules';
import { Guild } from 'eris';

export default class extends Event {
    constructor(bot: YamashiroClient) {
        super(bot, DiscordEvent.GUILD_DELETED);
    }

    async emit(guild: Guild) {
        this.bot.prometheus.guildCount.dec();
        this.bot.logger.info(`Left ${guild.name} (${guild.id})`);
        this.bot.settings.remove(guild.id);
        
        //* Edit the status
        this.bot.editStatus(ActivityStatus.ONLINE, {
            name: `${this.bot.config.discord.prefix}help | ${this.bot.guilds.size.toLocaleString()} Guilds`,
            type: ActivityType.PLAYING
        });

        //* Webhook Stuff
        const owner  = this.bot.users.get(guild.ownerID)!;
        const embed  = this.bot.getEmbed()
            .setAuthor(`| Guild ${guild.name} (${guild.id})`, undefined, guild.icon? guild.iconURL: this.bot.avatar)
            .setThumbnail(guild.icon? guild.iconURL!: this.bot.avatar)
            .addField('ID', guild.id, true)
            .addField('Created At', dateformat(guild.createdAt, 'mm/dd/yyyy hh:MM:ss TT'), true)
            .addField('Owner', `${owner.tag} (${guild.ownerID})`, true)
            .addField(`Members [${guild.memberCount}]`, `**${guild.members.filter(g => g.user.bot).length} Bots** | **${guild.members.filter(g => !g.user.bot).length} Humans**`, true)
            .addField(`Channels [${guild.channels.size}]`, `**${guild.channels.filter(c => c.type === 0).length} Text** | **${guild.channels.filter(c => c.type === 2).length} Voice**`, true)
            .build();

        this.bot.webhook.send(`<a:confusedDoggo:629791751149715467> **| Left ${guild.name}...**`, embed);
    }
}