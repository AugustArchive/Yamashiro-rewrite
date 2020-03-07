import { YamashiroClient, Command, Context } from '../../Structures';
import { stripIndents } from 'common-tags';
import { humanize } from '@yamashiro/modules';
import Util from '../../Utils/Util';
import * as sys from '@augu/sysinfo';
import os from 'os';

export default class extends Command {
    constructor(bot: YamashiroClient) {
        super(bot, {
            name: 'sysinfo',
            description: 'Shows information about the current system running',
            moduleID: 'system',
            ownerOnly: true,
            aliases: ['sys', 'system']
        });
    }

    async run(ctx: Context) {
        const cpu   = os.cpus();
        const _cpu  = sys.getCpuInfo();

        const embed = this
            .bot
            .getEmbed()
            .setAuthor('| System Information', undefined, this.bot.avatar)
            .setDescription(stripIndents`
                \`\`\`prolog
                CPU Usage     -> ${sys.getCpuUsage()}%
                Total Memory  -> ${Util.parseMemory(sys.getTotalMemory())}
                Free Memory   -> ${Util.parseMemory(sys.getFreeMemory())}
                Platform      -> ${sys.getPlatform()}
                Total CPUs    -> ${sys.getCpuCount()}
                System Uptime -> ${humanize(Math.round(os.uptime() * 1000))}
                Current CPU   -> ${cpu[0].model} (${Util.parseMemory(_cpu.idle)} idling; ${Util.parseMemory(_cpu.total)} total)
                \`\`\`
            `)
            .build();

        return void ctx.embed(embed);
    }
}