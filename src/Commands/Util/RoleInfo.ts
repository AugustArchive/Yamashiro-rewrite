import { YamashiroClient, Command, Context } from '../../Structures';
import { Permission, Constants } from 'eris';
import { Permissions } from '../../Utils/Constants';
import { dateformat } from '@yamashiro/modules';

export default class extends Command {
    constructor(bot: YamashiroClient) {
        super(bot, {
            name: 'roleinfo',
            description: 'Get info of a role in the guild',
            moduleID: 'util',
            usage: '[role]',
            aliases: ['role', 'rinfo']
        });
    }

    async run(ctx: Context) {
        //* if the argument is empty, if the roles have a length, then randomize the member roles, then random the guild's role and return the id, or provides the argument
        const roleID = ctx.args.isEmpty(0)? ctx.member.roles.length? ctx.member.roles.random(): ctx.guild.roles.random().id: ctx.args.join(' ');
        const role   = await this.bot.rest.getRole(roleID, ctx.guild);
        
        let rgb = [0, 0, 0];
        if (role.color > 0) rgb = this.hexToRgb(`#${role.color.toString(16)}`)!;

        const members = ctx.guild.members.filter(s => s.roles.includes(role.id));
        const perms   = this.getAllPerms(role.permissions);
        const embed   = this.bot.getEmbed()
            .setAuthor(`| Role ${role.name}`, undefined, this.bot.avatar)
            .setColor(role.color)
            .addField('Role ID', role.id, true)
            .addField('Created At', dateformat(role.createdAt, 'mm/dd/yyyy hh:MM:ss TT'), true)
            .addField('Position', `#${(role.position - 1)}`, true)
            .addField('Mentionable', role.mentionable? 'Yes': 'No', true)
            .addField('Hoisted', role.hoist? 'Yes': 'No', true)
            .addField('Managed', role.managed? 'Yes': 'No', true)
            .addField('Color', role.color === 0? 'None': `#${role.color.toString(16)} **[${rgb[0]}, ${rgb[1]}, ${rgb[2]}]**`, true)
            .addField('Members', members.length.format(), true)
            .addField('Permissions', perms.map<string>(s => `**${Permissions[s]}**`).join(' | '));

        return void ctx.embed(embed.build());
    }

    hexToRgb(hex: string): [number, number, number] | null {
        const regex = (/^#?([a-f\d])([a-f\d])([a-f\d])$/i);
        hex = hex.replace(regex, (_, r, g, b) => r + r + g + g + b + b);
        const result = (/^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i).exec(hex);
        return result? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]: null;
    }

    getAllPerms(_permission: Permission) {
        const allowed: string[] = [];
        for (const permission of Object.keys(Constants.Permissions)) {
            if (!permission.startsWith('all')) {
                if (_permission.allow & Constants.Permissions[permission]) allowed.push(permission);
                else continue;
            }
        }

        return allowed;
    }
}