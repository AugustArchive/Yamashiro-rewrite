import { YamashiroClient, Event } from '../Structures';
import { DiscordEvent } from '../Utils/Constants';

export default class extends Event {
    constructor(bot: YamashiroClient) {
        super(bot, DiscordEvent.SHARD_READY);
    }

    async emit(id: number) {
        this.bot.logger.discord(`Shard #${id} has connected to Discord!`);
        this.bot.webhook.embed(
            this
                .bot
                .getEmbed()
                .setAuthor(`| Shard #${id} has connected`, undefined, this.bot.avatar)
                .build()
        );
    }
}