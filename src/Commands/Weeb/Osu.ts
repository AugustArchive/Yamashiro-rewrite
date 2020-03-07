import { YamashiroClient, Command, Context } from '../../Structures';
import { DiscordEmoji, Colors } from '../../Utils/Constants';
import { stripIndents } from 'common-tags';
import { EmbedOptions } from 'eris';
import { humanize } from '@yamashiro/modules';
import { get } from 'wumpfetch';

enum Mods {
    None            = 0,
    NoFail          = 1,
    Easy            = 2,
    TouchDevice     = 4,
    Hidden          = 8,
    HardRock        = 16,
    SuddenDeath     = 32,
    DoubleTime      = 64,
    Relax           = 128,
    HalfTime        = 256,
    Nightcore       = 512,
    Flashlight      = 1024,
    Autoplay        = 2048,
    SpunOut         = 4096,
    Relax2          = 8192,
    Perfect         = 16384,
    Key4            = 32768,
    Key5            = 65536,
    Key6            = 131072,
    Key7            = 262144,
    Key8            = 524288,
    FadeIn          = 1048576,
    Random          = 2097152,
    Cinema          = 4194304,
    Target          = 8388608,
    Key9            = 16777216,
    KeyCoop         = 33554432,
    Key1            = 67108864,
    Key3            = 134217728,
    Key2            = 268435456,
    ScoreV2         = 536870912,
    Mirror          = 1073741824,
    AllKeyMods      = Key1 | Key2 | Key3 | Key4 | Key5 | Key6 | Key7 | Key8 | Key9 | KeyCoop,
    FreeModsAllowed = NoFail | Easy | Hidden | HardRock | SuddenDeath | Flashlight | FadeIn | Relax | Relax2 | SpunOut | AllKeyMods,
    ScoreIncreased  = Hidden | HardRock | DoubleTime | Flashlight | FadeIn
}

interface User {
    user_id: string;
    username: string;
    join_date: string;
    count300: string;
    count100: string;
    count50: string;
    playcount: string;
    ranked_score: string;
    total_score: string;
    pp_rank: string;
    level: string;
    pp_raw: string;
    accuracy: string;
    count_rank_ss: string;
    count_rank_ssh: string;
    count_rank_sh: string;
    count_rank_s: string;
    count_rank_a: string;
    country: string;
    total_seconds_played: string;
    pp_country_rank: string;
}

interface BestPlay {
    beatmap_id: string;
    score_id: string;
    score: string;
    maxcombo: string;
    count50: string;
    count100: string;
    count300: string;
    countmiss: string;
    countkatu: string;
    countgeki: string;
    prefect: string;
    enabled_mods: string;
    date: string;
    rank: string;
    pp: string;
    replay_avaliable: string;
}

interface Beatmap {
    beatmapset_id: string;
    beatmap_id: string;
    approved: string;
    total_length: string;
    hit_length: string;
    version: string;
    diff_size: string; //* Circle Size
    diff_overall: string; //* Overall Difficulty
    diff_approach: string; //* Approach Rate
    diff_drain: string; //* Health Drain
    mode: string;
    count_normal: string; //* Circles
    count_slider: string; //* Sliders
    count_spinner: string; //* Spinners
    submit_date: string;
    approved_date: string;
    last_update: string;
    artist: string;
    title: string;
    creator: string;
    creator_id: string;
    bpm: string;
    source: string;
    tags: string;
    genre_id: string;
    language_id: string;
    favourite_count: string;
    rating: string;
    download_unavaliable: string;
    audio_unavailable: string;
    playcount: string;
    passcount: string;
    max_combo: string;
    diff_aim: string;
    diff_speed: string;
    difficultyrating: string;
}

export default class extends Command {
    constructor(bot: YamashiroClient) {
        super(bot, {
            name: 'osu',
            description: 'Grabs information about an user, beatmap, or their top plays.',
            usage: '<"user" | "plays" | "beatmap"> <id>',
            moduleID: 'weeb'
        });
    }

    async user(name: string, mode: number) {
        if (!name) return `${DiscordEmoji.ERROR} **| No username was provided.**`;

        try {
            const res  = await get(`https://osu.ppy.sh/api/get_user?k=${this.bot.config.apis.ppy}&u=${name}&m=${mode}`).send();
            const info = res.json<User[]>();

            if (!info.length) return `${DiscordEmoji.ERROR} **| Unable to get user "${name}" due to not being listed?`;
            
            const _plays = await get(`https://osu.ppy.sh/api/get_user_best?k=${this.bot.config.apis.ppy}&u=${info[0].user_id}&m=${mode}`).send();
            const plays  = _plays.json<BestPlay[]>();
            let beatmaps: Beatmap[] = [];

            if (plays.length) {
                const b = await this._getBeatmapListingsForReplays(plays);
                beatmaps.push(...b);
            }

            return this.bot.getEmbed()
                .setTitle(`User "${info[0].username}" (#${info[0].user_id})`)
                .setDescription(beatmaps.length? beatmaps.map((s, i) => `• **${s.artist} - ${s.title} with ${plays[i].maxcombo}x, gained ${Number(plays[i].pp).toFixed()}pp**`).truncate(5).join('\n'): '**User hasn\'t played enough to get top plays.**')
                .setColor(Colors.OSU)
                .addField('Joined At', info[0].join_date, true)
                .addField('Play Count', info[0].playcount, true)
                .addField('Ranked/Total Score', `${info[0].ranked_score}/${info[0].total_score} (${((Number(info[0].ranked_score) / Number(info[0].total_score)) * 100).toFixed()}% ranked)`, true)
                .addField('Current Rank', `#${Number(info[0].pp_rank).format()}`, true)
                .addField('Level', Number(info[0].level).format(), true)
                .addField('Accuracy', `${parseFloat(info[0].accuracy).toFixed(2)}%`, true)
                .addField('Total Play Time', humanize(Number(info[0].total_seconds_played) * 1000), true)
                .addField('Country', info[0].country, true)
                .addField('Count Bitrates', stripIndents`
                    **Clicking**:
                    • **300**: ${Number(info[0].count300).format()}
                    • **100**: ${Number(info[0].count100).format()}
                    • **50**: ${Number(info[0].count50).format()}

                    **Rank Scores**:
                    • **SS**: ${Number(info[0].count_rank_ss).format()}
                    • **SSH**: ${Number(info[0].count_rank_ssh).format()}
                    • **S**: ${Number(info[0].count_rank_s).format()}
                    • **SH**: ${Number(info[0].count_rank_sh)}
                    • **A**: ${Number(info[0].count_rank_a)}
                `, true)
                .build();
        } catch(ex) {
            return `${DiscordEmoji.ERROR} **| Unable to get information on "${name}"...**`;
        }
    }

    async plays(name: string, mode: number) {
        if (!name) return `${DiscordEmoji.ERROR} **| No username was provided.**`;

        try { 
            const resu = await get(`https://osu.ppy.sh/api/get_user_best?k=${this.bot.config.apis.ppy}&u=${name}&m=${mode}`).send();
            const info = resu.json<BestPlay[]>().truncate(5);
            
            if (!info.length) return `${DiscordEmoji.ERROR} **| No replays has been set by ${name}.**`;
            let beatmaps = await this._getBeatmapListingsForReplays(info);
            beatmaps = beatmaps.truncate(5);

            return this.bot.getEmbed()
                .setTitle(`Replays for ${name}:`)
                .setColor(Colors.OSU)
                .setDescription(beatmaps.map((s, i) => `• **${s.artist} - ${s.title} with ${info[i].maxcombo}x, gained ${Number(info[i].pp).toFixed()}pp**`).truncate(5).join('\n'))
                .build();
        } catch(e) {
            return `${DiscordEmoji.ERROR} **| Unable to get top replays for ${name}.**`;
        }
    }

    async beatmap(tag: string, id: string) {
        if (!id) return this.bot.getEmbed()
            .setTitle('No "id" paramater was set!')
            .setColor(Colors.OSU)
            .setDescription(stripIndents`
                **Hello ${tag}-senpai, since you didn't provide a "id" paramater, I'll show you how you can use this**
                To fetch the info, you need to get a beatmap and look at it's url
                It should be like this (with different ids): <https://osu.ppy.sh/beatmapsets/41823#osu/131891>
                You must use the last numeric value (i.e: \`131891\`) to use as a paramater
            `)
            .build();

        try {
            const resu = await get(`https://osu.ppy.sh/api/get_beatmaps?k=${this.bot.config.apis.ppy}&b=${id}`).send();
            const info = resu.json<Beatmap[]>();
            if (!info.length) return `${DiscordEmoji.ERROR} **| Unable to fetch "${id}" due not existing.**`;

            return this.bot.getEmbed()
                .setColor(Colors.OSU)
                .setTitle(`Beatmap "${info[0].artist} - ${info[0].title}**`)
                .addField('Approved State', this._parseApprovedState(info[0].approved), true)
                .addField('Highest Difficulty', `**${info[0].version}** (${parseFloat(info[0].difficultyrating).toFixed(2)} stars)`)
                .addField('Creator', `**${info[0].creator}**`, true)
                .addField('Circle Size', info[0].diff_size, true)
                .addField('Overall Difficulty', info[0].diff_overall, true)
                .addField('Approach Rate', info[0].diff_approach, true)
                .addField('Health Drain', info[0].diff_drain, true)
                .addField('Circles', info[0].count_normal, true)
                .addField('Sliders', info[0].count_slider, true)
                .addField('Spinners', info[0].count_spinner, true)
                .addField('BPM (Beats per Minute)', parseFloat(info[0].bpm).toFixed(), true)
                .addField('Source', info[0].source || 'None', true)
                .addField('Tags', info[0].tags.split(' ').join(' | '), true)
                .addField('Genre', this._parseGenre(info[0].genre_id), true)
                .addField('Language', this._parseLanguage(info[0].language_id), true)
                .addField('Max Combo', `**${info[0].max_combo}x**`, true)
                .addField('Play/Pass Count', `${Number(info[0].passcount).format()}/${Number(info[0].playcount).format()} (${((Number(info[0].passcount) / Number(info[0].playcount)) * 100).toFixed()}% passed)`, true)
                .build();
        } catch {
            return `${DiscordEmoji.ERROR} **| Couldn't get information on beatmap id "${id}"**`;
        }
    }

    async run(ctx: Context) {
        if (!this.bot.config.apis.ppy) return void ctx.send(`${DiscordEmoji.INFO} **| Sorry admiral, my commanders didn't add the api key to let me fetch info!**`);

        const sub = ctx.args.get(0);
        switch (sub) {
            case 'user': {
                const mode = ctx.args.get(2);

                if (mode && isNaN(Number(mode))) return void ctx.send(`${DiscordEmoji.ERROR} **| Invalid mode. (0 = std, 1 = taiko, 2 = ctb, 3 = mania)**`);
                if (mode && Number(mode) > 3) return void ctx.send(`${DiscordEmoji.ERROR} **| Invalid mode to choose from (0 = std, 1 = taiko, 2 = ctb, 3 = mania)**`);
            
                const result = await this.user(ctx.args.get(1), Number(mode) || 0);
                return (result instanceof Object)? void ctx.embed(result as EmbedOptions): void ctx.send(result as string);
            }
            case 'plays': {
                const mode = ctx.args.get(2);

                if (mode && isNaN(Number(mode))) return void ctx.send(`${DiscordEmoji.ERROR} **| Invalid mode. (0 = std, 1 = taiko, 2 = ctb, 3 = mania)**`);
                if (mode && Number(mode) > 3) return void ctx.send(`${DiscordEmoji.ERROR} **| Invalid mode to choose from (0 = std, 1 = taiko, 2 = ctb, 3 = mania)**`);
            
                const result = await this.plays(ctx.args.get(1), Number(mode));
                return (result instanceof Object)? void ctx.embed(result as EmbedOptions): void ctx.send(result as string);
            }
            case 'beatmap': {
                const result = await this.beatmap(ctx.sender.tag, ctx.args.get(1));
                return (result instanceof Object)? void ctx.embed(result as EmbedOptions): void ctx.send(result as string);
            }
            default: return void ctx.send(`${DiscordEmoji.ERROR} **| ${sub === undefined? 'No subcommand was provided': 'Invalid subcommand.'}**`);
        }
    }

    private async _getBeatmapListingsForReplays(plays: BestPlay[]) {
        const beatmaps: Beatmap[] = [];
        for (const play of plays) {
            try {
                const res  = await get(`https://osu.ppy.sh/api/get_beatmaps?k=${this.bot.config.apis.ppy}&b=${play.beatmap_id}`).send();
                const info = res.json<Beatmap[]>();
                if (!info.length) continue;

                beatmaps.push(info[0]);
            } catch {
                continue;
            }
        }

        return beatmaps;
    }

    private _parseGenre(genre: string) {
        const types: { [x: string]: string } = {
            '0': 'Any',
            '1': 'Unspecified',
            '2': 'Video Game',
            '3': 'Anime',
            '4': 'Rock',
            '5': 'Pop',
            '6': 'Other',
            '7': 'Novelty',
            '9': 'Hip Hop',
            '10': 'Electronic'
        };

        return (types[genre] as string);
    }

    private _parseLanguage(lang: string) {
        const types: { [x: string]: string } = {
            '0': 'Any',
            '1': 'Other',
            '2': 'English',
            '3': 'Japanese',
            '4': 'Chinese',
            '5': 'Instrumental',
            '6': 'Korean',
            '7': 'French',
            '8': 'German',
            '9': 'Swedish',
            '10': 'Spanish',
            '11': 'Italian'
        };

        return (types[lang] as string);
    }

    private _parseApprovedState(state: string) {
        const types: { [x: string]: string } = {
            '-2': 'Graveyard',
            '-1': 'Work in Progress',
            '0': 'Pending',
            '1': 'Ranked',
            '2': 'Approved',
            '3': 'Qualified',
            '4': 'Loved'
        };

        return (types[state] as string);
    }
}