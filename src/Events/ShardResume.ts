import { YamashiroClient, Event } from '../Structures';
import { DiscordEvent } from '../Utils/Constants';

export default class extends Event {
    constructor(bot: YamashiroClient) {
        super(bot, DiscordEvent.SHARD_RESUME);
    }

    async emit(id: number) {
        this.bot.logger.discord(`Shard #${id} has reconnected to Discord!`);
        this.bot.webhook.embed(
            this
                .bot
                .getEmbed()
                .setAuthor(`| Shard #${id} has reconnected`, undefined, this.bot.avatar)
                .build()
        );
    }
}