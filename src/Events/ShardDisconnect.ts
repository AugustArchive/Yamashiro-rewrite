import { YamashiroClient, Event } from '../Structures';
import { captureException } from '@sentry/node';
import { stripIndents } from 'common-tags';
import { DiscordEvent } from '../Utils/Constants';

export default class extends Event {
    constructor(bot: YamashiroClient) {
        super(bot, DiscordEvent.SHARD_DISCONNECT);
    }

    async emit(error: Error, id: number) {
        this.bot.logger.discord(`Shard #${id} has disconnected because of:\n${error}`);
        captureException(error);

        const message = error.stack? error.stack.split('\n'): ['UndefinedError: No stacktrace was provided', 'at null'];
        this.bot.webhook.embed(
            this
                .bot
                .getEmbed()
                .setAuthor(`| Shard #${id} has disconnected`, undefined, this.bot.avatar)
                .setDescription(stripIndents`
                    **Callstack Trace**
                    \`\`\`js
                    ${message[0]}
                    ${message[1]}
                    \`\`\`
                `)
                .build()
        );
    }
}