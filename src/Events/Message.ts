import { YamashiroClient, Event } from '../Structures';
import { DiscordEvent } from '../Utils/Constants';
import CommandService from '../Structures/Services/CommandService';
import { Message } from 'eris';

export default class extends Event {
    public service: CommandService;

    constructor(bot: YamashiroClient) {
        super(bot, DiscordEvent.MESSAGE);

        this.service = new CommandService(bot);
    }

    async emit(m: Message) {
        this.service.process(m);
    }
}