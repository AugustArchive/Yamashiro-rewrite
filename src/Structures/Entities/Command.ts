import YamashiroClient from './Client';
import Context from './Context';
import Module from './Module';

interface CommandMeta {
    name: string;
    description: string;
    moduleID: string;
    usage?: string;
    aliases?: string[];
    guarded?: boolean;
    hidden?: boolean;
    guildOnly?: boolean;
    ownerOnly?: boolean;
    votelocked?: boolean;
    cooldown?: number;
    nsfw?: boolean;
    disabled?: boolean;
}
export default abstract class Command {
    public description: string;
    public votelocked: boolean;
    public ownerOnly: boolean;
    public guildOnly: boolean;
    public cooldown: number;
    public disabled: boolean;
    public aliases: string[];
    public guarded: boolean;
    public hidden: boolean;
    public module: Module;
    public usage: string;
    public nsfw: boolean;
    public name: string;
    public bot: YamashiroClient;

    constructor(bot: YamashiroClient, meta: CommandMeta) {
        this.description = meta.description;
        this.votelocked  = meta.votelocked || false;
        this.ownerOnly   = meta.ownerOnly || false;
        this.guildOnly   = meta.guildOnly || false;
        this.cooldown    = meta.cooldown || 5;
        this.disabled    = meta.disabled || false;
        this.aliases     = meta.aliases || [];
        this.guarded     = meta.guarded || false;
        this.hidden      = meta.hidden || false;
        this.module      = bot.manager.modules.get(meta.moduleID)!;
        this.usage       = meta.usage || '';
        this.nsfw        = meta.nsfw || false;
        this.name        = meta.name;
        this.bot         = bot;
    }

    public abstract run(ctx: Context): Promise<void>;

    format() {
        const prefix = this.bot.config.discord.prefix;
        return `${prefix}${this.name}${this.usage? ` ${this.usage}`: ''}`;
    }

    help() {
        return this
            .bot
            .getEmbed()
            .setAuthor(`| Command ${this.name}`, `https://shipgirl.augu.dev/commands/${this.name}`, this.bot.avatar)
            .setDescription(`**${this.description}**`)
            .setThumbnail(this.bot.avatar)
            .addField('Syntax', this.format(), true)
            .addField('Module', `${this.module.emoji} **${this.module.name.captialize()}**`, true)
            .addField(`Alias${this.aliases.length? 'es': ''}`, this.aliases.length? this.aliases.join(', '): 'None', true)
            .addField('Guarded', this.guarded? 'Yes': 'No', true)
            .addField('Upvoters Only', this.votelocked? 'Yes': 'No', true)
            .addField('NSFW', this.nsfw? 'Yes': 'No', true)
            .addField('Owner Only', this.ownerOnly? 'Yes': 'No', true)
            .addField('Guild Only', this.guildOnly? 'Yes': 'No', true)
            .build();
    }    
}