import { DiscordEmoji, SUPPORT_SERVER } from '../../Utils/Constants';
import { Message, TextChannel } from 'eris';
import { captureException } from '@sentry/node';
import { stripIndents } from 'common-tags';
import YamashiroClient from '../Entities/Client';
import { Collection } from '@augu/immutable';
import CommandContext from '../Entities/Context';
import { humanize } from '@yamashiro/modules';
import { get } from 'wumpfetch';

export default class CommandService {
    public ratelimits: Collection<Collection<number>> = new Collection('ratelimits');
    public bot: YamashiroClient;

    constructor(bot: YamashiroClient) {
        this.bot = bot;
    }

    async process(msg: Message): Promise<void> {
        this.bot.prometheus.messageSeen.inc();
        this.bot.statistics.messagesSeen = this.bot.statistics.messagesSeen + 1;
        if (msg.author.bot) return;

        const user     = await this.bot.database.users.get(msg.author.id);
        const guild    = (msg.channel as TextChannel).guild;
        const settings = await this.bot.settings.get(guild.id);

        if (user.blacklisted) return;

        let prefix: string | null = null;
        const mention = new RegExp(`<@!?${this.bot.user.id}> `).exec(msg.content);
        const prefixes = [this.bot.config.discord.prefix, settings.prefix, `${mention}`];

        for (const pref of prefixes) {
            if (msg.content.startsWith(pref)) prefix = pref;
        }

        if (!prefix) return;

        const args    = msg.content.slice(prefix.length).trim().split(/ +/g);
        const name    = args.shift()!;
        const command = this.bot.manager.commands.filter((_cmd) =>
            _cmd.name === name || _cmd.aliases.includes(name)
        );

        const context = new CommandContext(this.bot, msg, args)
            .setPrefix(prefix);
            
        if (command.length) {
            const cmd  = command[0];
            const help = context.flags.get('help') || context.flags.get('h');
            if (help && typeof help === 'boolean') {
                const embed = cmd.help();
                context.embed(embed);
                //* dont run any commands when "--help" or "--h" flag has been added
                return;
            }

            //* Do not run/send messages when a command or module is disabled
            if (settings.disabledCommands.includes(cmd.name)) return;
            if (settings.disabledModules.includes(cmd.module.name)) return;

            if (cmd.guildOnly && msg.channel.type !== 0) {
                context.send(`${DiscordEmoji.ERROR} **| Admiral, you must be in a guild to execute the \`${cmd.name}\` command.**`);
                return;
            }

            if (cmd.nsfw && !(msg.channel as TextChannel).nsfw) {
                context.send(`${DiscordEmoji.ERROR} **| Admiral, you must be in an NSFW-marked channel to execute the \`${cmd.name}\` command.**`);
                return;
            }

            if (cmd.ownerOnly && !this.bot.admins.includes(msg.author.id)) {
                context.send(`${DiscordEmoji.ERROR} **| Admiral, you must be one of my Commanders to execute the \`${cmd.name}\` command.**`);
                return;
            }

            //* Premium users get access to upvoter commands
            if (cmd.votelocked && !this.bot.admins.includes(msg.author.id) && !user.premium) {
                const res = (await get(`https://api.augu.dev/webhook/check?userID=${msg.author.id}`).send()).json();
                if (!res.success) {
                    const embed = this.bot.getEmbed()
                        .setAuthor(`| Command ${cmd.name} is locked`, 'https://discord.boats/bot/yamashiro', 'https://discord.boats/logo.png')
                        .setThumbnail('https://discord.boats/logo.png')
                        .setDescription(stripIndents`
                            **The command \`${cmd.name}\` is currently only usable by upvoters!**
                            To get access, you must vote [Yamashiro](https://discord.boats/bot/yamashiro) on discord.boats,
                            then it should unlock automatically when you have! If it doesn't give you access,
                            report it to my commanders at <${SUPPORT_SERVER}>!
                        `)
                        .build();
                    context.embed(embed);
                    return;
                }
            }

            if (cmd.disabled) {
                context.send(`${DiscordEmoji.ERROR} **| Command "${cmd.name}" is disabled.**`);
                return;
            }

            //* Ratelimit the user if it's not a dev
            if (!this.bot.admins.includes(msg.author.id)) {
                if (!this.ratelimits.has(cmd.name)) this.ratelimits.set(cmd.name, new Collection(`ratelimit:${cmd.name}`));
            
                const now = Date.now();
                const throttle = (cmd.cooldown) * 1000;
                const timestamp = this.ratelimits.get(cmd.name)!;
                if (!timestamp.has(msg.author.id)) {
                    timestamp.set(msg.author.id, now);
                    setTimeout(() => timestamp.delete(msg.author.id), throttle);
                } else {
                    const time = timestamp.get(msg.author.id)!;
                    if (now < time) {
                        const left = (time - now) / 1000;
                        const embed = this.bot.getEmbed()
                            .setAuthor(`| Command ${cmd.name} is on cooldown!`, undefined, this.bot.avatar)
                            .setThumbnail(this.bot.avatar)
                            .setDescription(`**Admiral ${msg.author.tag}, the command \`${cmd.name}\` is on cooldown for ${humanize(left, { long: true })}`)
                            .build();

                        context.embed(embed);
                    }

                    timestamp.set(msg.author.id, now);
                    setTimeout(() => timestamp.delete(msg.author.id), throttle);
                }
            }

            try {
                await cmd.run(context);

                //* dont increment system-related commands
                if (cmd.module.name !== 'system') this.bot.statistics.increment(cmd);
                this.bot.prometheus.commandsExecuted.inc();
                this.bot.logger.info(`Ran command "${cmd.name}" in guild (${context.guild.id}): ${context.guild.name} by ${msg.author.tag}`);
            } catch(ex) {
                const message = ex.stack? ex.stack.split('\n'): ['UndefintionError: Unable to get stack', 'at null', 'fuck node'];
                const owners = this.bot.admins.map((userID) => {
                    const user = this.bot.users.get(userID)!;
                    if (!user) return '**Unknown User#0000**';
                    return `**${user.tag}**`;
                }).list('or');

                const embed = this.bot.getEmbed()
                    .setAuthor(`| Command ${cmd.name} has failed!`, undefined, this.bot.avatar)
                    .setDescription(stripIndents`
                        **Command has failed for**:
                        \`\`\`js
                        ${message[0]}
                        ${message[1]}
                        ${message[2]}
                        \`\`\`

                        If this keeps happening, report it to my commanders: ${owners} at <${SUPPORT_SERVER}>~
                    `).build();

                context.embed(embed);
                this.bot.logger.error(`Unable to run the command "${cmd.name}":\n${ex.stack}`);
                captureException(ex);
            }
        }
    }
}