import { GroupEmojis, COLOR } from '../../Utils/Constants';
import YamashiroClient from './Client';
import { Collection } from '@augu/immutable';
import EmbedBuilder from './EmbedBuilder';
import Command from './Command';

export default class Module {
    public commands: Collection<Command>;
    public name: string;
    public bot: YamashiroClient;

    constructor(bot: YamashiroClient, name: string) {
        this.commands = new Collection(`module:${name}:commands`);
        this.name = name;
        this.bot = bot;
    }

    help() {
        const embed = this.bot.getEmbed()
            .setAuthor(`| Module ${this.name.captialize()}`, undefined, this.bot.avatar);

        const commandList = this.commands.toArray().filter(cmd => !cmd.ownerOnly);
        const propLength  = (cmd: Command): number => cmd.name.length;
        const commands    = propLength(
            commandList.sort((a, b) =>
                propLength(b) - propLength(a)
            )[0]
        );

        embed.setDescription(this.commands.map(cmd => {
            const format = cmd.name;
            return `\`${format.padEnd((commands * 2) - cmd.name.length, ' \u200b')}\` | \u200b \u200b**${cmd.description}** `;
        }).join('\n'));

        return embed.build();
    }

    get emoji(): string {
        return GroupEmojis[this.name];
    }
}