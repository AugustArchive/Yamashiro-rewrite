import { YamashiroClient, Command, Context } from '../../Structures';
import { DiscordEmoji } from '../../Utils/Constants';
import User from '../../Models/UserModel';

export default class extends Command {
    constructor(bot: YamashiroClient) {
        super(bot, {
            name: 'whitelist',
            description: 'Whitelists a user (if they were blocked before)',
            moduleID: 'system',
            ownerOnly: true
        });
    }

    async run(ctx: Context) {
        if (ctx.args.isEmpty(0)) return void ctx.send(`${DiscordEmoji.ERROR} **| No user name, mention, or ID was provided.**`);

        const id = ctx.args.get(0);
        const u = await this.bot.rest.getUser(id);

        if (!u) return void ctx.send(`${DiscordEmoji.ERROR} **| Commander, I was unable to find user "${id}"**`);
        if (u.id === ctx.sender.id) return void ctx.send(`${DiscordEmoji.ERROR} **| Uhm, I would like to know why you got in this? Did you eval, because it seems like you did.**`);
        if (u.id === this.bot.user.id) return void ctx.send(`${DiscordEmoji.ERROR} **| W-w-w-why was I b-b-b-blacklisted?!???!**`);
        if (this.bot.admins.includes(u.id)) return void ctx.send(`${DiscordEmoji.ERROR} **| My commanders should be whitelisted, I think...**`);
        
        const sample = await User.findOne({ userID: u.id });
        if (!sample || sample === null) return void ctx.send(`${DiscordEmoji.ERROR} **| Unable to whitelist ${u.tag} due to not being in the database.**`);
        if (!sample.blacklisted) return void ctx.send(`${DiscordEmoji.INFO} **| User ${u.tag} is already whitelisted**`);
        
        await this.bot.database.users.update(u.id, {
            $set: {
                'blacklisted': false
            }
        });

        return void ctx.send(`${DiscordEmoji.SUCCESS} **| User ${u.tag} is now whitelisted.**`);
    }
}