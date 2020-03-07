import { YamashiroClient, Event } from '../Structures';
import { Guild, Member } from 'eris';
import { DiscordEvent } from '../Utils/Constants';

export default class extends Event {
    constructor(bot: YamashiroClient) {
        super(bot, DiscordEvent.GUILD_MEMBER_JOINED);
    }

    async emit(guild: Guild, member: Member) {
        const settings = await this.bot.settings.get(guild.id);
        if (settings.autoroles.length) {
            for (const roleID of settings.autoroles) {
                this.bot.logger.info(`Member ${member.tag} has joined and the guild owner needed to add ${settings.autoroles.length} roles!`);
                await member.addRole(roleID, `[Autorole]: Added role ${guild.roles.get(roleID)!.name} to ${member.tag}`);
            }
        }
    }
}