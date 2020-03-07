import { YamashiroClient, Event } from '../Structures';
import { DiscordEvent } from '../Utils/Constants';
import { Message } from 'eris';

export default class extends Event {
    constructor(bot: YamashiroClient) {
        super(bot, DiscordEvent.MESSAGE_DELETED);
    }

    async emit(m: Message) {
        this.bot.snipes.process(m);
    }
}