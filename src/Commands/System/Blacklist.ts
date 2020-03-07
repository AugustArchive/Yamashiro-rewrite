import { YamashiroClient, Command, Context } from '../../Structures';
import { DiscordEmoji } from '../../Utils/Constants';
import User from '../../Models/UserModel';

export default class extends Command {
    constructor(bot: YamashiroClient) {
        super(bot, {
            name: 'blacklist',
            description: 'Blacklists a user from using me!',
            moduleID: 'system',
            ownerOnly: true
        });
    }

    async run(ctx: Context) {
        if (ctx.args.isEmpty(0)) return void ctx.send(`${DiscordEmoji.ERROR} **| No user name, mention, or ID was provided.**`);

        const id = ctx.args.get(0);
        const u = await this.bot.rest.getUser(id);

        if (!u) return void ctx.send(`${DiscordEmoji.ERROR} **| Commander, I was unable to find user "${id}"**`);
        if (u.id === ctx.sender.id) return void ctx.send(`${DiscordEmoji.ERROR} **| Why would you block yourself. Seems pretty odd...**`);
        if (u.id === this.bot.user.id) return void ctx.send(`${DiscordEmoji.ERROR} **| W-why should I be b-blacklisted?! What did I do wrong... :c**`);
        if (this.bot.admins.includes(u.id)) return void ctx.send(`${DiscordEmoji.ERROR} **| I will not blacklist my commanders, commander!**`);
        
        const sample = await User.findOne({ userID: u.id });
        if (!sample || sample === null) return void ctx.send(`${DiscordEmoji.ERROR} **| Unable to blacklist ${u.tag} due to not being in the database.**`);

        if (sample.blacklisted) return void ctx.send(`${DiscordEmoji.INFO} **| User ${u.tag} is already blacklisted**`);
        await this.bot.database.users.update(u.id, {
            $set: {
                'blacklisted': true
            }
        });

        return void ctx.send(`${DiscordEmoji.SUCCESS} **| User ${u.tag} is now blacklisted.**`);
    }
}