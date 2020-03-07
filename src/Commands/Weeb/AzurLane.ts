import { YamashiroClient, Command, Context, EmbedBuilder } from '../../Structures';
import { DiscordEmoji, Colors } from '../../Utils/Constants';
import { get } from 'wumpfetch';

interface ShipgirlResult {
    //* useless shit that I dont wanna deal or use
    statusCode: number;
    statusMessage: string;
    message: string;
    ship: {
        wikiUrl: string;
        id: string;
        thumbnail: string;
        chibi: string;
        buildTime: string;
        rarity: string;
        class: string;
        nationality: string;
        nationalityShort: string | null;
        hullType: string;
        miscellaneous: {
            artist: {
                link: string;
                name: string;
            }
            voiceActress: {
                link: string;
                name: string;
            }
        }
        stars: {
            value: string;
            count: number;
        }
        names: {
            en: string;
            cn: string;
            jp: string;
            kr: string;
        }
        skins: {
            title: string;
            image: string;
            chibi: string;
        }[];
        stats: {
            '100': { name: string; image: string; value: string | number; }[] | null;
            '120': { name: string; image: string; value: string | number; }[] | null;
            'base': { name: string; image: string; value: string; }[] | null;
            'retrofit100': { name: string; image: string; value: string; }[] | null;
            'retrofit120': { name: string; image: string; value: string; }[] | null;
        }
    }
}

export default class extends Command {
    constructor(bot: YamashiroClient) {
        super(bot, {
            name: 'azurlane',
            description: 'Grabs information of an Azur Lane shipgirl or their skins avaliable',
            moduleID: 'weeb',
            usage: '<ship> / <"skins"> <ship> [--page/--p=<number>]',
            aliases: ['al']
        });
    }

    async run(ctx: Context) {
        const subcommand = ctx.args.get(0);
        switch (subcommand) {
            case 'skin':
            case 'skins': {
                try {
                    const result = await get(`https://azurlane-api.appspot.com/v1/ship?name=${encodeURIComponent(ctx.args.sliceAll(1).join('+'))}`).send();
                    const { ship: info } = result.json<ShipgirlResult>();

                    if (info.rarity === 'Unreleased') return void ctx.send(`${DiscordEmoji.ERROR} **| Hey! I won't post the skins for "${info.names.en}" due to her not being finished! Admiral-senpai, you need to know that I'm not gonna fetch this for you.**`);
                    if (info.skins.length > 1) {
                        let page = ctx.flags.get('page') || ctx.flags.get('p');
                        if (page && typeof page === 'boolean') return void ctx.send(`${DiscordEmoji.ERROR} **| You must provide a page number. (ex: \`--page=1\`)**`);
                        
                        if (!page) page = '0';
                        if (page && isNaN(Number(page))) page = '0';
                        if (info.skins[page as string]) {
                            const embed = this.bot.getEmbed()
                                .setAuthor(`| Skin ${info.skins[page as string].title}`, info.wikiUrl, info.skins[page as string].chibi)
                                .setImage(info.skins[page as string].image)
                                .setFooter(`Page #${page}/${info.skins.length - 1}`)
                                .setColor(Colors.AZUR_LANE);
        
                            return void ctx.embed(embed.build());
                        } else {
                            return void ctx.send(`${DiscordEmoji.ERROR} **| Invalid page: ${page}**`);
                        }
                    } else {
                        const embed = this.bot.getEmbed()
                            .setAuthor('| Default Skin', undefined, info.skins[0].chibi)
                            .setImage(info.skins[0].image)
                            .setColor(Colors.AZUR_LANE);

                        return void ctx.embed(embed.build());
                    }
                } catch(ex) {
                    console.error(ex);
                    return void ctx.send(`${DiscordEmoji.HUH} **| Unable to fetch skins for "${ctx.args.sliceAll(1).join(' ')}"`);
                }
            }

            default: {
                if (!subcommand) return void ctx.send(`${DiscordEmoji.ERROR} **| No shipgirl or the "skins" subcommand was provided.**`);

                try {
                    const result = await get(`https://azurlane-api.appspot.com/v1/ship?name=${encodeURIComponent(ctx.args.join('+'))}`).send();

                    const { ship: info } = result.json<ShipgirlResult>();
                    if (info.rarity === 'Unreleased') return void ctx.send(`${DiscordEmoji.INFO} **| Ship "${info.names.en}" is currently unreleased in the game, I'm telling you this because I'm not fetching information on a unreleased shipgirl unlike me, admiral~**`);

                    const embed = this.bot.getEmbed()
                        .setAuthor(`| Ship ${info.names.en} (${info.names.jp})`, info.wikiUrl, info.thumbnail)
                        .setThumbnail(info.chibi)
                        .addField('Ship ID', info.id, true)
                        .addField('Build Time', info.buildTime, true)
                        .addField('Rarity', info.rarity, true)
                        .addField('Nationality', info.nationality, true)
                        .addField('Voice Actress', `**[${info.miscellaneous.voiceActress.name}](${info.miscellaneous.voiceActress.link})**`, true)
                        .addField('Artist', `**[${info.miscellaneous.artist.name}](${info.miscellaneous.artist.link})**`, true)
                        .setFooter(`To view skins, use "${ctx.prefix}azurlane skins ${subcommand}"`);

                    if (info.stats['base']) embed.addField('Base Stats', info.stats.base.map(s => `• **${s.name}: ${s.value}**`).join('\n'), true);
                    if (info.stats['100']) embed.addField('Level 100 Stats', info.stats['100'].map(s => `• **${s.name}: ${s.value}**`).join('\n'), true);
                    if (info.stats['120']) embed.addField('Level 120 Stats', info.stats['120'].map(s => `• **${s.name}: ${s.value}**`).join('\n'), true);
                    if (info.stats.retrofit100) embed.addField('[Retrofit] Level 100 Stats', info.stats.retrofit100.map(s => `• **${s.name}: ${s.value}**`).join('\n'), true);
                    if (info.stats.retrofit120) embed.addField('[Retrofit] Level 120 Stats', info.stats.retrofit120.map(s => `• **${s.name}: ${s.value}**`).join('\n'), true);

                    return void ctx.embed(embed.build());
                } catch(ex) {
                    if (ex.statusCode === 404) return void ctx.send(`${DiscordEmoji.ERROR} **| Invalid shipgirl: "${subcommand}"**`);
                    console.error(ex);
                    return void ctx.send(`${DiscordEmoji.ERROR} **| Unable to fetch ship "${subcommand}"**`);
                } 
            }
        }
    }
}