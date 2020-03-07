import { EmbedOptions } from 'eris';
import { post } from 'wumpfetch';

export default class WebhookClient {
    constructor(public url: string) {}

    async send(content: string, embed?: EmbedOptions) {
        if (!content) return Promise.reject(new Error('No content was found to send.'));
        const embeds = embed? [embed]: undefined;
        await post(this.url, {
            data: {
                content,
                embeds
            }
        }).send();
    }

    async embed(embed: EmbedOptions) {
        const embeds = [embed];
        await post(this.url, {
            data: {
                embeds
            }
        }).send();
    }
}