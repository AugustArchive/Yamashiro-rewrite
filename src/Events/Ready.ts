import { YamashiroClient, Event, Colors as chalk } from '../Structures';
import { DiscordEvent, ActivityStatus } from '../Utils/Constants';
import { stripIndents } from 'common-tags';

export default class extends Event {
    constructor(bot: YamashiroClient) {
        super(bot, DiscordEvent.READY);
    }

    async emit() {
        //* Send message to console and webhook
        this.bot.logger.discord(`Connected to Discord as ${this.bot.user.tag}! Connected to ${chalk.blue(this.bot.guilds.size.toString())} ports and ${chalk.blue(this.bot.users.size.toString())} admirals!`);
        this.bot.webhook.embed(
            this
                .bot
                .getEmbed()
                .setAuthor(`| ${this.bot.user.tag} is ready!`, 'https://shipgirl.augu.dev', this.bot.avatar)
                .setDescription(stripIndents`
                    \`\`\`prolog
                    Guilds:   ${this.bot.guilds.size}
                    Users:    ${this.bot.users.size}
                    Channels: ${Object.keys(this.bot.channelGuildMap).length}
                    Shards:   ${this.bot.shards.size}
                    Commands: ${this.bot.manager.commands.size}
                    Modules [${this.bot.manager.modules.size}]:  ${this.bot.manager.modules.map(s => s.name.captialize()).join(', ')}
                    \`\`\`
                `)
                .build()
        );

        this.bot.editStatus(ActivityStatus.ONLINE, {
            name: `${this.bot.config.discord.prefix}help | ${this.bot.guilds.size} Guilds`,
            type: 0
        });
        this.bot.prometheus.guildCount.set(this.bot.guilds.size);
        this.bot.prometheus.server.listen(3347, () => this.bot.logger.info(`${chalk.blue('Prometheus')} server is now listening on ${chalk.magenta('3347')}!`));
        this.bot.tasks.forEach(async(task) => {
            this.bot.logger.info(`Running task ${task.name}...`);
            await task.run();
            if (!task._timer) {
                task._timer = setInterval(async() => {
                    this.bot.logger.info(`Now running task ${task.name}`);
                    await task.run();
                }, task.interval);
            }
        });
    }
}