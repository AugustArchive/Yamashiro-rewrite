import { YamashiroClient, Command, Context } from '../../Structures';
import { DiscordEmoji } from '../../Utils/Constants';

export default class extends Command {
    constructor(bot: YamashiroClient) {
        super(bot, {
            name: 'snipe',
            description: 'Snipes a message',
            usage: '[channel]',
            moduleID: 'util',
            aliases: ['delmsg'],
            guildOnly: true,
            disabled: true
        });
    }

    async run(ctx: Context) {
        const settings = await this.bot.settings.get(ctx.guild.id);
        if (!settings.snipes) return void ctx.send(`${DiscordEmoji.INFO} **| Guild ${ctx.guild.name} has disabled snipes.**`);

        if (ctx.args.isEmpty(0)) {
            const snipes = this.bot.snipes.cache.get(`${ctx.channel.id}:${ctx.guild.id}:snipes`);
            if (!snipes || !snipes.length) return void ctx.send(`${DiscordEmoji.ERROR} **| No snipes have been found**`);
        
            const sniped = snipes[0];
            const structure = this.bot.getEmbed()
                .setAuthor(`| ${sniped.author.tag}`, undefined, sniped.author.avatarURL || sniped.author.defaultAvatarURL)
                .setTimestamp(new Date(sniped.timestamp))
                .setDescription(sniped.content);

            if (sniped.embed) {
                if ('url' in sniped.embed) structure.setURL(sniped.embed.url!);
                if ('title' in sniped.embed) structure.setTitle(sniped.embed.title!);
                if ('image' in sniped.embed) structure.setImage(sniped.embed.image!.url!);
                if ('fields' in sniped.embed) sniped.embed.fields!.forEach(field => structure.addField(field.name!, field.value!, field.inline));
                if ('thumbnail' in sniped.embed) structure.setThumbnail(sniped.embed.thumbnail!.url!);
                if ('description' in sniped.embed) structure.setDescription(sniped.embed.description!);
            }

            if (!structure.image && sniped.attachments) structure.setImage(sniped.attachments!.url);

            snipes.remove(sniped);
            if (!snipes.length) this.bot.snipes.cache.delete(`${ctx.channel.id}:${ctx.guild.id}:snipes`);
            else this.bot.snipes.cache.set(`${ctx.channel.id}:${ctx.guild.id}:snipes`, snipes);

            return void ctx.embed(structure.build());
        } else {
            const snipes = this.bot.snipes.cache.get(`${ctx.channel.id}:${ctx.guild.id}:snipes`);
            if (!snipes || !snipes.length) return void ctx.send(`${DiscordEmoji.ERROR} **| No snipes have been found**`);
        
            const sniped = snipes[0];
            const structure = this.bot.getEmbed()
                .setAuthor(`| ${sniped.author.tag}`, undefined, sniped.author.avatarURL || sniped.author.defaultAvatarURL)
                .setTimestamp(new Date(sniped.timestamp))
                .setDescription(sniped.content);

            if (sniped.embed) {
                if ('url' in sniped.embed) structure.setURL(sniped.embed.url!);
                if ('title' in sniped.embed) structure.setTitle(sniped.embed.title!);
                if ('image' in sniped.embed) structure.setImage(sniped.embed.image!.url!);
                if ('fields' in sniped.embed) sniped.embed.fields!.forEach(field => structure.addField(field.name!, field.value!, field.inline));
                if ('thumbnail' in sniped.embed) structure.setThumbnail(sniped.embed.thumbnail!.url!);
                if ('description' in sniped.embed) structure.setDescription(sniped.embed.description!);
            }

            if (!structure.image && sniped.attachments) structure.setImage(sniped.attachments!.url);

            snipes.remove(sniped);
            if (!snipes.length) this.bot.snipes.cache.delete(`${ctx.channel.id}:${ctx.guild.id}:snipes`);
            else this.bot.snipes.cache.set(`${ctx.channel.id}:${ctx.guild.id}:snipes`, snipes);

            return void ctx.embed(structure.build());
        }
    }
}