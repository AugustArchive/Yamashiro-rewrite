import { YamashiroClient, Command, Context } from '../../Structures';
import { DiscordEmoji } from '../../Utils/Constants';

export default class extends Command {
    constructor(bot: YamashiroClient) {
        super(bot, {
            name: 'cleandb',
            description: 'Cleans the database',
            moduleID: 'system',
            ownerOnly: true
        });
    }

    async run(ctx: Context) {
        const msg = await ctx.send(`${DiscordEmoji.LOADING} **| Commander, I am now cleaning the database...**`);
        const documents = await this.bot.settings.getDocuments();

        let cursor = 0;
        documents.forEach(async (doc) => {
            if (!this.bot.guilds.has(doc.guildID)) {
                cursor++;
                await this.bot.settings.remove(doc.guildID);
            } else {
                return;
            }
        });

        if (cursor === 0) return void msg.edit(`${DiscordEmoji.INFO} **| No dead documents were found.**`);
        return void msg.edit(`${DiscordEmoji.SUCCESS} **| Cleaned the database. ${cursor} documents were removed from the database.**`);
    }
}