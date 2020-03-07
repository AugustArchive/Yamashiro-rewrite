import { YamashiroClient, Command, Context } from '../../Structures';
import { DiscordEmoji, Colors } from '../../Utils/Constants';
import { stripIndents } from 'common-tags';
import { get } from 'wumpfetch';

interface CFResponse {
    url: string;
}

interface KitsuResponse {
    data: AnimeResponse[];
}

interface AnimeResponse {
    id: string;
    type: 'anime' | 'manga';
    links: {
        self: string;
    }
    attributes: {
        createdAt: string;
        updatedAt: string;
        slug: string;
        synopsis: string;
        coverImageTopOffset: number;
        canonicalTitle: string;
        abbreviatedTitles: string[];
        averageRating: string;
        userCount: number;
        favoritesCount: number;
        startDate: string;
        endDate: string;
        nextRelease: null;
        popularityRank: number;
        ratingRank: string;
        ageRating: string;
        ageRatingGuide: string;
        subtype: string;
        status: string;
        tba: string;
        episodeCount: number;
        episodeLength: number;
        totalLength: number;
        youtubeVideoId: string | null;
        showType: string;
        nsfw: boolean;
        posterImage: {
            tiny: string;
            small: string;
            large: string;
            original: string;
            meta: {
                dimensions: {
                    [x in 'tiny' | 'small' | 'medium' | 'large']: {
                        width: number | null;
                        height: number | null;
                    }
                }
            }
        }
        coverImage: {
            tiny: string;
            small: string;
            large: string;
            original: string;
            meta: {
                dimensions: {
                    [x in 'tiny' | 'small' | 'medium' | 'large']: {
                        width: number | null;
                        height: number | null;
                    }
                }
            }
        } | null;
        ratingFrequencies: {
            [x in '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15' | '16' | '17' | '18' | '19' | '20']: string;
        };
        titles: {
            en: string | null;
            en_jp: string | null;
            ja_jp: string | null;
        }
    }
}

export default class extends Command {
    constructor(bot: YamashiroClient) {
        super(bot, {
            name: 'anime',
            description: 'Searches on Kitsu for an anime or provide a random anime picture',
            moduleID: 'weeb',
            aliases: ['animu']
        });
    }

    async run(ctx: Context) {
        if (ctx.args.isEmpty(0)) {
            try {
                const result = await get('https://api.computerfreaker.pw/v1/anime').send();
                const { url } = result.json<CFResponse>();
                return void ctx.embed(
                    this
                        .bot
                        .getEmbed()
                        .setImage(url)
                        .setColor(Colors.EMILLIA)
                        .setFooter('Powered by api.computerfreaker.pw')
                        .build()
                );
            } catch {
                return void ctx.send(`${DiscordEmoji.ERROR} **| Unable to get a random anime picture**`);
            }
        } else {
            const animeTitle = ctx.args.sliceAll(0).join(' ');
            try {
                const result = await get(`https://kitsu.io/api/edge/anime?filter[text]=${encodeURIComponent(animeTitle)}`)
                    .header({
                        Accept: 'application/vnd.api+json',
                        'Content-Type': 'application/vnd.api+json'
                    })
                    .send();

                const info = result.json<KitsuResponse>();
                const msg = await ctx.send(stripIndents`
                    ${DiscordEmoji.INFO} **| While title do you want information from?**
                    ${this._makeTitles(info.data)}

                    Type \`cancel\` to cancel this entry.
                    You have 60 seconds to decide.
                `);

                const collected = await ctx.awaitMessage(m => m.author.id === ctx.sender.id && ['1', '2', '3', '4', '5', 'cancel'].includes(m.content));
                if (!collected.content) {
                    await msg.delete();
                    return void ctx.send(`${DiscordEmoji.INFO} **| Cancelled entry due to no response.**`);
                }

                if (collected.content === 'cancel') {
                    await msg.delete();
                    return void ctx.send(`${DiscordEmoji.INFO} **| Ok ${ctx.sender.username}-senpai, I won't get information.**`);
                }

                const index = Number(collected.content) - 1;
                const data = info.data[index];
                if (data.attributes.nsfw) return void ctx.send(`${DiscordEmoji.ERROR} **| A-admiral! How could you! I'm not gonna get information on some lewd show! Baka, baka, baka!**`);

                const line1 = data.attributes.titles.en_jp? data.attributes.titles.en_jp: '';
                const line2 = data.attributes.titles.en? `/${data.attributes.titles.en}`: '';
                const embed = this.bot.getEmbed()
                    .setTitle(`${line1}${line2}${data.attributes.titles.ja_jp? ` (${data.attributes.titles.ja_jp})`: ''}`)
                    .setThumbnail(data.attributes.posterImage.original)
                    .setDescription(data.attributes.synopsis.elipisis(1994))
                    .setColor(Colors.KITSU)
                    .addField('Average Rating', `**${data.attributes.averageRating}%**`, true)
                    .addField('Favorites Count', data.attributes.favoritesCount.format(), true)
                    .addField('Popularity Rank', `#**${data.attributes.popularityRank.format()}**`, true)
                    .addField('Rating Rank', `#**${data.attributes.ratingRank}**`, true)
                    .addField('Episode Count', data.attributes.episodeCount.toString(), true)
                    .addField('Started Airing', data.attributes.startDate || '???', true)
                    .addField('Ended Airing', data.attributes.endDate || '???', true)
                    .build();

                return void ctx.embed(embed);
            } catch(ex) {
                return void ctx.send(`${DiscordEmoji.ERROR} **| Unable to get information on "${animeTitle}"**`);
            }
        }
    }

    _makeTitles(data: AnimeResponse[]) {
        const s: string[] = [];
        for (let i = 0; i < 5; i++) {
            const { attributes: anime }= data[i];
            const line1 = anime.titles.en_jp? anime.titles.en_jp: '';
            const line2 = anime.titles.en? `/${anime.titles.en}`: '';
            s.push(`${i + 1}. **${line1}${line2}**`);
        }

        return s.join('\n');
    }
}