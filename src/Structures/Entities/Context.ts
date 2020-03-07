import { User, Guild, Message, TextChannel, EmbedOptions } from 'eris';
import ReactionCollector, { ReactionCollectorOptions } from '../Collectors/ReactionCollector';
import { MessageCollector } from '@yamashiro/utils';
import YamashiroClient from './Client';
import ArgumentParser from '../Parsers/ArgumentParser';
import FlagParser from '../Parsers/FlagParser';

export default class CommandContext {
    public message: Message;
    public guild: Guild;
    public flags: FlagParser;
    public args: ArgumentParser;
    public bot: YamashiroClient;
    public prefix!: string;

    constructor(client: YamashiroClient, msg: Message, args: string[]) {
        this.message = msg;
        this.guild   = (msg.channel as TextChannel).guild;
        this.flags   = new FlagParser(args);
        this.args    = new ArgumentParser(args);
        this.bot     = client;
    }

    get self() {
        return this.guild.members.get(this.bot.user.id)!;
    }

    get member() {
        return this.message.member || this.guild.members.get(this.message.author.id)!;
    }

    get sender() {
        return this.message.author;
    }

    get channel() {
        return this.message.channel;
    }

    setPrefix(prefix: string) {
        this.prefix = prefix;
        return this;
    }

    awaitMessage(filter: (m: Message) => boolean, timeout?: number) {
        const collector = new MessageCollector(this.bot);
        return collector.awaitMessage(filter, {
            channelID: this.message.channel.id,
            userID: this.message.author.id,
            timeout: timeout || 60
        });
    }

    createReactionCollector(filter: (m: Message) => boolean, options?: ReactionCollectorOptions) {
        return new ReactionCollector(this.bot, this.message, filter, options);
    }

    send(content: string, embed?: EmbedOptions) {
        return this.message.channel.createMessage({
            content,
            embed
        });
    }

    embed(embed: EmbedOptions) {
        return this.message.channel.createMessage({
            embed
        });
    }

    code(lang: string, content: string) {
        const cb = '```';
        return this.send(`${cb}${lang}\n${content}\n${cb}`);
    }

    async dm(user: User, content: string, options?: { embed: EmbedOptions }) {
        const channel = await user.getDMChannel();
        return channel.createMessage({
            content,
            embed: options? options.embed: undefined
        });
    }
}
