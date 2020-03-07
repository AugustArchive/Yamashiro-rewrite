import { YamashiroClient, Command, Context } from '../../Structures';
import { DiscordEmoji, Colors } from '../../Utils/Constants';
import { EmbedOptions } from 'eris';
import { get } from 'wumpfetch';

interface TwitchTopGames {
    _total: number;
    top: {
        channels: number;
        viewers: number;
        game: {
            _id: number;
            giantbomb_id: number;
            name: string;
            popularity: number;
            box: {
                large: string;
                medium: string;
                small: string;
                template: string;
            }
            logo: {
                large: string;
                medium: string;
                small: string;
                template: string;
            }
        }
    }[];
}

interface TwitchUser {
    _id: string;
    bio: string;
    created_at: string;
    display_name: string;
    logo: string;
    name: string;
    type: string;
    updated_at: string;
}

interface TwitchUserLookups {
    _total: number;
    users: TwitchUser[];
}

export default class extends Command {
    public subcommands: string[] = ['user', 'game'];
    constructor(bot: YamashiroClient) {
        super(bot, {
            name: 'twitch',
            description: 'Grabs information on a Twitch user or game',
            moduleID: 'util',
            usage: '<"user" | "game"> <value>'
        });
    }

    async user(ctx: Context) {
        if (ctx.args.isEmpty(1)) return `${DiscordEmoji.ERROR} **| You must specify a user name (hint: you can use ',' to search more then one! example: \`quackityhq,alinity\` and it'll prompt of what you want!)`;
    
        try {
            const resp = await get(`https://api.twitch.tv/kraken/users?login=${ctx.args.get(1)}`)
                .header({
                    'Client-ID': this.bot.config.apis.twitch,
                    Accept: 'application/vnd.twitchtv.v5+json'
                }).send();

            const json = resp.json<TwitchUserLookups>();
            if (!json.users.length) return `${DiscordEmoji.ERROR} **| User "${ctx.args.get(1)}" was not found...**`;
            const resu = await get(`https://api.twitch.tv/kraken/users/${json.users[0]._id}`)
                .header({
                    'Client-ID': this.bot.config.apis.twitch,
                    Accept: 'application/vnd.twitchtv.v5+json'
                }).send();

            const data = resu.json<TwitchUser>();
            return this.bot.getEmbed()
                .setAuthor(`| User "${data.name}"`, `https://twitch.tv/${data.display_name}`, data.logo)
                .setThumbnail(data.logo)
                .setColor(Colors.TWITCH)
                .setDescription(`**${data.bio}**`)
                .addField('User ID', data._id, true)
                .addField('Created At', new Date(data.created_at).toLocaleString(), true)
                .addField('Updated At', new Date(data.updated_at).toLocaleString(), true)
                .build();
        } catch(ex) {
            return `${DiscordEmoji.ERROR} **| Unable to get information on user "${ctx.args.get(1)}".**`;
        }
    }

    async game() {
        try {
            const result = await get('https://api.twitch.tv/kraken/games/top?imit=5')
                .header({
                    'Client-ID': this.bot.config.apis.twitch,
                    Accept: 'application/vnd.twitchtv.v5+json'
                })
                .send();

            const info = result.json<TwitchTopGames>();
            return this.bot.getEmbed()
                .setAuthor('| Top 5 Twitch Games', undefined, 'https://cdn.discordapp.com/attachments/626525058910912514/637503400233140237/twitch.png')
                .setColor(Colors.TWITCH)
                .setDescription(info.top.map(s => `• **${s.game.name} with ${s.channels} channels streaming and ${s.viewers} total concurrent viewers**`).truncate(5).join('\n').replace('[...]', ''))
                .build();
        } catch(ex) {
            return `${DiscordEmoji.ERROR} **| Unable to get the top games.**`;
        }
    }

    async run(ctx: Context) {
        if (!this.bot.config.apis.twitch) return void ctx.send(`${DiscordEmoji.INFO} **| This command is disabled due to no API key implemented.**`);

        const subcommand = ctx.args.get(0);
        switch (subcommand) {
            case 'user': {
                const result = await this.user(ctx);
                return void (result instanceof Object? ctx.embed(result as EmbedOptions): ctx.send(result as string));
            }

            case 'game': {
                const result = await this.game();
                return void (result instanceof Object? ctx.embed(result as EmbedOptions): ctx.send(result as string));
            }

            default: return void ctx.send(`${DiscordEmoji.ERROR} **| ${subcommand === undefined? `Invalid subcommand (${this.subcommands.list()})`: `Invalid subcommand "${subcommand}"`}**`);
        }
    }
}