import { YamashiroClient, Command, Context } from '../../Structures';
import { DiscordEmoji } from '../../Utils/Constants';

export default class extends Command {
    constructor(bot: YamashiroClient) {
        super(bot, {
            name: 'donator',
            description: 'Adds/removes donators',
            moduleID: 'system',
            ownerOnly: true
        });
    }

    async run(ctx: Context) {
        const subcommands = ['add', 'remove'];
        const subcommand = ctx.args.get(0);

        switch (subcommand) {
            case 'add': {
                if (ctx.args.isEmpty(1)) return void ctx.send(`${DiscordEmoji.ERROR} **| No user ID, name, or mention was provided.**`);

                const id = ctx.args.get(1);
                const us = await this.bot.rest.getUser(id);
                if (!us) return void ctx.send(`${DiscordEmoji.ERROR} **| Unable to find "${id}"**`);

                await this.bot.database.users.update(us.id, {
                    $set: {
                        'premium': true,
                        'tier': ctx.args.isEmpty(2)? 1: Number(ctx.args.get(2))
                    }
                });

                return void ctx.send(`${DiscordEmoji.SUCCESS} **| Yay! ${us.tag} is now a Premium user!**`);
            }
            case 'remove': {
                if (ctx.args.isEmpty(1)) return void ctx.send(`${DiscordEmoji.ERROR} **| No user ID, name, or mention was provided.**`);

                const id = ctx.args.get(1);
                const us = await this.bot.rest.getUser(id);
                if (!us) return void ctx.send(`${DiscordEmoji.ERROR} **| Unable to find "${id}"**`);

                await this.bot.database.users.update(us.id, {
                    $set: {
                        'premium': false
                    }
                });

                return void ctx.send(`${DiscordEmoji.ERROR} **| RIP! ${us.tag} is no longer a Premium user**`);
            }
            case 'list': {
                const users: string[] = [];
                const guild = this.bot.guilds.get('382725233695522816')!;
                guild.members.filter(s => s.roles.includes('605210216270921728')).map(s => users.push(s.id));

                return void ctx.embed(
                    this.bot.getEmbed()
                        .setTitle('Donators')
                        .setDescription(users.map(s => {
                            const user = this.bot.users.get(s);
                            if (!user) return 'Unknown User#0000';
                            return user.tag;
                        }).join(' | '))
                        .build()
                );
            }
            default: return void ctx.send(`${DiscordEmoji.ERROR} **| ${subcommand === undefined? `Commander, you didn't provide a subcommand. (${subcommands.list()})`: `Commander, subcommand "${subcommand}" is invalid. (${subcommands.list()})`}**`);
        }
    }
}