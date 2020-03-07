import { Message, Emoji } from 'eris';
import { EventEmitter } from 'events';
import { Collection } from '@augu/immutable';
import ReactionEmoji from './ReactionEmoji';
import DiscordClient from '../Entities/Client';

type Filter = (msg: Message) => boolean;
enum ReactionStatus {
    CONCURRENTING = 'concurrenting',
    NOT_READY = 'not.ready',
    ENDED = 'ended'
}

export interface ReactionCollectorOptions {
    timeout?: number;
}
export default class ReactionCollector extends EventEmitter {
    public collected: Collection<ReactionEmoji> = new Collection('collector:emojis');
    public message: Message;
    public timeout: number;
    public status: string = ReactionStatus.NOT_READY;
    public filter: Filter;

    constructor(public client: DiscordClient, message: Message, filter: Filter, options: ReactionCollectorOptions = { timeout: 120000 }) {
        super();

        this.message = message;
        this.timeout = options.timeout || 120000;
        this.filter  = filter;

        client.on('messageReactionAdd', this.onReaction.bind(this));
        setTimeout(() => {
            this.status = ReactionStatus.ENDED;
            this.stop();
        }, this.timeout);
    }

    onReaction(m: Message, emoji: Emoji, userID: string) {
        this.status = ReactionStatus.CONCURRENTING;

        if (this.message.id !== m.id) return;
        if (this.filter(m)) {
            const reaction = new ReactionEmoji(m, emoji);
            this.collected.set(`${m.channel.id}:${userID}`, reaction);
            this.emit('reaction', reaction);
        }
    }

    stop() {
        if (this.status === ReactionStatus.ENDED) return;

        this.status = ReactionStatus.ENDED;
        this.client.removeListener('messageReactionAdd', this.onReaction);
        this.emit('ended', this.collected);
    }

    public on(event: 'ended', listener: (collected: Collection<ReactionEmoji>) => void): this;
    public on(event: 'reaction', listener: (emoji: ReactionEmoji) => void): this;
    public on(event: string, listener: (...args: any[]) => void) {
        return super.on(event, listener);
    }
}