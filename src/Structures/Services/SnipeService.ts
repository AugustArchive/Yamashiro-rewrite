import { Message, TextChannel, User, EmbedOptions, Attachment } from 'eris';
import YamashiroClient from '../Entities/Client';
import { Collection } from '@augu/immutable';

interface ISnipe {
    attachments: Attachment | null;
    timestamp: number;
    content: string;
    channel: TextChannel;
    author: User;
    embed: EmbedOptions | null;
}
export default class SnipeService {
    public cache: Collection<ISnipe[]> = new Collection('snipes');
    constructor(public bot: YamashiroClient) {}
    
    async process(m: Message) {
        if (!m.author || !(m.channel instanceof TextChannel)) return;
        const settings = await this.bot.settings.get((m.channel as TextChannel).guild.id);
        
        if (!settings.snipes) return;

        const channel = (m.channel as TextChannel);
        const array = this.cache.get(`${channel.id}:${channel.guild.id}:snipes`) || [];
        array.push({
            attachments: m.attachments.length? m.attachments[0]: null,
            timestamp: m.timestamp,
            content: m.content,
            channel,
            author: m.author,
            embed: m.embeds.length? m.embeds[0]: null
        });

        this.cache.set(`${channel.id}:${channel.guild.id}:snipes`, array);
    }
}