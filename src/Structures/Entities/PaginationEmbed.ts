import { Message, EmbedOptions } from 'eris';
import ReactionCollector from '../Collectors/ReactionCollector';
import DiscordClient from '../Entities/Client';

interface PaginationEmbedOptions {
    deleteButton?: string;
    firstButton?: string;
    lastButton?: string;
    backButton?: string;
    forthButton?: string;
    maxMatches?: number;
    startPage?: number;
    timeout?: number;
    cycle?: boolean;
    showPageNumbers?: boolean;
    extendButtons?: boolean;
}

/**
 * NOTE: **This was not made by me, this is a mockup of [eris-pagination](https://github.com/riyacchi/eris-pagination) but in TypeScript**
 */
export default class PaginationEmbed {
    public message: Message | undefined = undefined;
    public handler: ReactionCollector | undefined = undefined;
    public pages: EmbedOptions[];
    public invoked: Message;
    public options: PaginationEmbedOptions;
    public deleteBtn: string;
    public firstPageBtn: string;
    public lastPageBtn: string;
    public backBtn: string;
    public forthBtn: string;
    public index: number;
    public matches: number;
    public timeout: number;
    public cycle: boolean;
    public showPages: boolean;
    public extend: boolean;

    constructor(message: Message, pages: EmbedOptions[], options: PaginationEmbedOptions = {}) {
        this.pages        = pages;
        this.invoked      = message;
        this.options      = options;
        this.deleteBtn    = options.deleteButton || '🗑';
        this.firstPageBtn = options.firstButton || '⏮';
        this.lastPageBtn  = options.lastButton || '⏭';
        this.backBtn      = options.backButton || '⬅';
        this.forthBtn     = options.forthButton || '➡';
        this.index        = options.startPage || 1;
        this.matches      = options.maxMatches || 50;
        this.timeout      = options.timeout || 300000;
        this.cycle        = options.cycle || false;
        this.showPages    = options.showPageNumbers || true;
        this.extend       = options.extendButtons || false;
    }

    static async create(client: DiscordClient, message: Message, pages: EmbedOptions[], options: PaginationEmbedOptions = {}) {
        const instance = new PaginationEmbed(message, pages, options);
        await instance.initialize(client);
        instance.run();

        return Promise.resolve(instance.message!);
    }

    initialize(client: DiscordClient) {
        return new Promise<void>(async(resolve, reject) => {
            if (this.pages.length < 2) reject(new Error('Need atleast 2 pages.'));
            if (this.index < 1 || this.index > this.pages.length) reject(new Error(`Invalid start page. Must be between 1-${this.pages.length}...`));
            if (this.matches > 100) reject(new Error('Maximum amount of pages has been exceeded.'));
            if (this.timeout > 900000) reject(new Error('The timeout session is too high.'));
            
            this.message = await this.invoked.channel.createMessage({
                embed: Object.assign(this.pages[this.index - 1], { footer: { text: `Page ${this.index}/${this.pages.length - 1}` }})
            });

            this.handler = new ReactionCollector(client, this.message, (msg) => msg.author.id === this.invoked.author.id, { timeout: this.timeout });
            if (this.extend) {
                await this.message.addReaction(this.firstPageBtn);
                await this.message.addReaction(this.backBtn);
                await this.message.addReaction(this.forthBtn);
                await this.message.addReaction(this.lastPageBtn);
                await this.message.addReaction(this.deleteBtn);
            } else {
                await this.message.addReaction(this.backBtn);
                await this.message.addReaction(this.forthBtn);
            }
        });
    }

    update() {
        this.message!.edit({
            embed: Object.assign(this.pages[this.index - 1], { footer: { text: `Page ${this.index}/${this.pages.length - 1}` }})
        });
    }

    run() {
        this.handler!.on('reaction', async(emoji) => {
            switch (emoji.name) {
                case this.firstPageBtn: {
                    if (this.extend) {
                        await this.message!.removeReaction(this.firstPageBtn, this.invoked.author.id);
                        if (this.index > 1) {
                            this.index = 1;
                            this.update();
                        }
                    } else {
                        break;
                    }
                } break;

                case this.backBtn: {
                    await this.message!.removeReaction(this.backBtn, this.invoked.author.id);
                    if (this.index > 1) {
                        this.index--;
                        this.update();
                    } else if (this.index === 1 && this.cycle) {
                        this.index = this.pages.length;
                        this.update();
                    }
                } break;

                case this.forthBtn: {
                    await this.message!.removeReaction(this.backBtn, this.invoked.author.id);
                    if (this.index < this.pages.length) {
                        this.index++;
                        this.update();
                    } else if (this.index === this.pages.length && this.cycle) {
                        this.index = 1;
                        this.update();
                    }
                } break;

                case this.lastPageBtn: {
                    if (this.extend) {
                        await this.message!.removeReaction(this.lastPageBtn, this.invoked.author.id);
                        if (this.index < this.pages.length) {
                            this.index = this.pages.length;
                            this.update();
                        }
                    } else {
                        break;
                    }
                } break;

                case this.deleteBtn: {
                    if (this.extend) {
                        await new Promise(res => {
                            this.message!.removeReactions().then(() => res());
                        });
                    } else {
                        break;
                    }
                } break;
            }
        });
    }
}