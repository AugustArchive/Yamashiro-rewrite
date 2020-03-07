import { YamashiroClient, Command, Context } from '../../Structures';
import { stripIndents } from 'common-tags';
import { DiscordEmoji } from '../../Utils/Constants';

export default class extends Command {
    constructor(bot: YamashiroClient) {
        super(bot, {
            name: 'config',
            description: 'Sets/resets/views the guild\'s settings',
            moduleID: 'core',
            aliases: ['cfg', 'configuration', 'settings'],
            usage: '<"keys" / "reset" / "add" / "remove" / "disable" / "enable"> <key> <value>',
            guarded: true
        });
    }

    async remove(ctx: Context) {
        const cfg = await this.bot.settings.get(ctx.guild.id);
        const key = ctx.args.get(1);
        switch (key) {
            case 'autoroles': {
                if (ctx.args.isEmpty(2)) return `${DiscordEmoji.ERROR} **| No role ID was provided.**`;

                const roleID = ctx.args.get(2);
                const role   = await this.bot.rest.getRole(roleID, ctx.guild);
                if (!cfg.autoroles.includes(role.id)) return `${DiscordEmoji.ERROR} **| No role with id "${roleID}" was not found.**`;

                await ctx.send(stripIndents`
                    ${DiscordEmoji.INFO} **| Are you sure you wanna delete role "${role.name}" from the autoroles array?**
                    Reply with \`yes\` to remove it or \`no\` or \`cancel\` to cancel the process
                    You have 60 seconds to decide the role's fate...
                `);

                const collected = await ctx.awaitMessage((m) => m.author.id === ctx.sender.id && ['yes', 'no', 'cancel'].includes(m.content));
                if (!collected.content) return `${DiscordEmoji.INFO} **| Will not remove \`${role.name}\` to autoroles due to no response.**`;
                if (['no', 'cancel'].includes(collected.content)) return `${DiscordEmoji.INFO} **| Will not remove \`${role.name}\` to autoroles**`;

                cfg.autoroles.remove(role.id);
                cfg.save();
                return `${DiscordEmoji.INFO} **| Role \`${role.name}\` was removed from the autoroles list.**`;
            }

            case 'subscriptions': {
                if (ctx.args.isEmpty(2)) return `${DiscordEmoji.ERROR} **| No role ID was provided.**`;

                const roleID = ctx.args.get(2);
                const role   = await this.bot.rest.getRole(roleID, ctx.guild);
                if (!cfg.subscriptionRoles.includes(role.id)) return `${DiscordEmoji.ERROR} **| No role with id "${roleID}" was not found.**`;
        
                await ctx.send(stripIndents`
                    ${DiscordEmoji.INFO} **| Are you sure you wanna delete role "${role.name}" from the subscriptions list?**
                    Reply with \`yes\` to remove it or \`no\` or \`cancel\` to cancel the process
                    You have 60 seconds to decide the role's fate...
                `);

                const collected = await ctx.awaitMessage((m) => m.author.id === ctx.sender.id && ['yes', 'no', 'cancel'].includes(m.content));
                if (!collected.content) return `${DiscordEmoji.INFO} **| Will not remove \`${role.name}\` to autoroles due to no response.**`;
                if (['no', 'cancel'].includes(collected.content)) return `${DiscordEmoji.INFO} **| Will not remove \`${role.name}\` to autoroles**`;

                cfg.subscriptionRoles.remove(role.id);
                cfg.save();
                return `${DiscordEmoji.INFO} **| Role \`${role.name}\` was removed from the subscriptions list.**`;
            }

            default: return `${DiscordEmoji.ERROR} **| ${key === undefined? 'No key was specified. (`autoroles`)': 'Invalid key.'}**`;
        }
    }

    async add(ctx: Context) {
        const cfg = await this.bot.settings.get(ctx.guild.id);
        const key = ctx.args.get(1);
        switch (key) {
            case 'autoroles': {
                if (ctx.args.isEmpty(2)) return `${DiscordEmoji.ERROR} **| No role ID, mention, or name was specified.**`;
                if (cfg.autoroles.length > 5) return `${DiscordEmoji.ERROR} **| You cannot add more then 5 autoroles due to ratelimiting.**`;

                const roleID = ctx.args.get(2);
                const role   = await this.bot.rest.getRole(roleID, ctx.guild);
                if (!role) return `${DiscordEmoji.ERROR} **| Role \`${roleID}\` was not found.**`;

                await ctx.send(stripIndents`
                    ${DiscordEmoji.INFO} **| Are you sure you wanna add \`${role.name}\` to the autoroles list?**
                    Reply with \`yes\` to add it or \`no\` or \`cancel\` to cancel the process
                    You have 60 seconds to decide the role's fate...
                `);

                const collected = await ctx.awaitMessage((m) => m.author.id === ctx.sender.id && ['yes', 'no', 'cancel'].includes(m.content));
                if (!collected.content) return `${DiscordEmoji.INFO} **| Will not add \`${role.name}\` to autoroles due to no response.**`;
                if (['no', 'cancel'].includes(collected.content)) return `${DiscordEmoji.INFO} **| Will not add \`${role.name}\` to autoroles**`;

                cfg.autoroles.push(role.id);
                cfg.save();
                return `${DiscordEmoji.OK} **| Added \`${role.name}\` to autoroles.**`;
            }

            case 'subscriptions': {
                if (ctx.args.isEmpty(2)) return `${DiscordEmoji.ERROR} **| No role ID was provided.**`;

                const roleID = ctx.args.get(2);
                const role   = await this.bot.rest.getRole(roleID, ctx.guild);
                if (!role) return `${DiscordEmoji.ERROR} **| Role "${roleID}" doesn't exist in the guild roles.**`;

                await ctx.send(stripIndents`
                    ${DiscordEmoji.INFO} **| Are you sure you wanna add role "${role.name}" to the subscriptions list?**
                    Reply with \`yes\` to remove it or \`no\` or \`cancel\` to cancel the process
                    You have 60 seconds to decide the role's fate...
                `);

                const collected = await ctx.awaitMessage((m) => m.author.id === ctx.sender.id && ['yes', 'no', 'cancel'].includes(m.content));
                if (!collected.content) return `${DiscordEmoji.INFO} **| Will not add \`${role.name}\` to autoroles due to no response.**`;
                if (['no', 'cancel'].includes(collected.content)) return `${DiscordEmoji.INFO} **| Will not add \`${role.name}\` to autoroles**`;

                cfg.subscriptionRoles.push(role.id);
                cfg.save();
                return `${DiscordEmoji.INFO} **| Role \`${role.name}\` has been added to the subscriptions list.**`;
            }

            default: return `${DiscordEmoji.ERROR} **| ${key === undefined? 'No key was specified. (`autoroles`)': 'Invalid key.'}**`;
        }
    }

    async view(ctx: Context) {
        const settings = await this.bot.settings.get(ctx.guild.id);

        return this.bot.getEmbed()
            .setAuthor(`| Configuration for ${ctx.guild.name}`, undefined, this.bot.avatar)
            .addField('__**Autoroles**__', settings.autoroles.map(s => {
                const role = ctx.guild.roles.get(s);
                if (!role) return 'Deleted Role';
                return `<@&${role.id}>`;
            }).join('\n') || 'None', true)
            .addField('__**Snipes**__', settings.snipes? 'Enabled': 'Disabled', true)
            .build();
    }

    async disable(ctx: Context) {
        const cfg = await this.bot.settings.get(ctx.guild.id);
        const key = ctx.args.get(1);
        switch (key) {
            case 'snipes': {
                if (!cfg.snipes) return `${DiscordEmoji.INFO} **| Snipes are disabled in ${ctx.guild.name}**`;

                await ctx.send(stripIndents`
                    ${DiscordEmoji.INFO} **| Are you sure you wanna disable snipes?**
                    Reply with \`yes\` to enable it or \`no\` or \`cancel\` to cancel the process
                    You have 60 seconds to decide...
                `);

                const collected = await ctx.awaitMessage((m) => m.author.id === ctx.sender.id && ['yes', 'no', 'cancel'].includes(m.content));
                if (!collected.content) return `${DiscordEmoji.INFO} **| Due to no response, I will not disable snipes**`;
                if (['no', 'cancel'].includes(collected.content)) return `${DiscordEmoji.INFO} **| Ok, I will not disable snipes**`;

                await this.bot.settings.update(ctx.guild.id, {
                    $set: {
                        'snipes': false
                    }
                });

                return `${DiscordEmoji.SUCCESS} **| Snipes have been disabled in ${ctx.guild.name}.**`;
            }

            default: return `${DiscordEmoji.ERROR} **| ${key === undefined? 'No subcommand was provided': 'Invalid subcommand'}**`;
        }
    }

    async enable(ctx: Context) {
        const cfg = await this.bot.settings.get(ctx.guild.id);
        const key = ctx.args.get(1);
        switch (key) {
            case 'snipes': {
                if (cfg.snipes) return `${DiscordEmoji.INFO} **| Snipes are enabled in ${ctx.guild.name}**`;

                await ctx.send(stripIndents`
                    ${DiscordEmoji.INFO} **| Are you sure you wanna enable snipes?**
                    Reply with \`yes\` to enable it or \`no\` or \`cancel\` to cancel the process
                    You have 60 seconds to decide...
                `);

                const collected = await ctx.awaitMessage((m) => m.author.id === ctx.sender.id && ['yes', 'no', 'cancel'].includes(m.content));
                if (!collected.content) return `${DiscordEmoji.INFO} **| Due to no response, I will not enable snipes**`;
                if (['no', 'cancel'].includes(collected.content)) return `${DiscordEmoji.INFO} **| Ok, I will not enable snipes**`;

                await this.bot.settings.update(ctx.guild.id, {
                    $set: {
                        'snipes': true
                    }
                });

                return `${DiscordEmoji.SUCCESS} **| Snipes have been enabled in ${ctx.guild.name}.**`;
            }

            default: return `${DiscordEmoji.ERROR} **| ${key === undefined? 'No subcommand was provided': 'Invalid subcommand'}**`;
        }
    }

    keys() {
        return this
            .bot
            .getEmbed()
            .setAuthor('| Configuration Keys', 'https://shipgirl.augu.dev/settings', this.bot.avatar)
            .setDescription(stripIndents`
                **Normal**:
                \`autoroles\` | \`subscriptions\` | \`snipes\`
            `)
            .build();
    }

    async run(ctx: Context) {
        const subcommand = ctx.args.get(0);

        if (!this.bot.admins.includes(ctx.sender.id) && !ctx.member.permission.has('manageGuild')) return void ctx.send(`${DiscordEmoji.ERROR} **| You don't have permission to edit the guild's settings. Requires the \`Manage Guild\` permission.**`);
        switch (subcommand) {
            case 'add': return void ctx.send(await this.add(ctx));
            case 'disable': return void ctx.send(await this.disable(ctx));
            case 'enable': return void ctx.send(await this.enable(ctx));
            case 'keys': return void ctx.embed(this.keys());
            case 'remove': return void ctx.send(await this.remove(ctx));
            case 'view': return void ctx.embed(await this.view(ctx));
            default: return void ctx.send(`${DiscordEmoji.ERROR} **| ${subcommand === undefined? 'No subcommand was provided.': 'Invalid subcommand. (review the command usage)'}**`);
        }
    }
}