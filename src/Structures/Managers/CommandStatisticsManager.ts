import Command from '../Entities/Command';

type CommandUsage = { [x: string]: number };
interface ICommandStat {
    command: string;
    uses: number;
}

export default class CommandStatisticsManager {
    public commandsExecuted: number = 0;
    public messagesSeen: number = 0;
    public commandUsage: CommandUsage = {};

    getMostUsedCommand(): ICommandStat {
        if (Object.keys(this.commandUsage).length > 0) {
            const commands = Object.keys(this.commandUsage)
                .map(key => ({
                    key,
                    uses: this.commandUsage[key]
                }))
                .sort((a, b) => b.uses - a.uses);

            return {
                command: commands[0].key,
                uses: this.commandUsage[commands[0].key]
            };
        } else {
            return {
                command: 'N/A',
                uses: 0
            };
        }
    }

    getAllMostUsedCommands() {
        const cmds: { key: string, uses: number; }[] = [];
        if (Object.keys(this.commandUsage).length > 0) {
            const commands = Object.keys(this.commandUsage)
                .map(key => ({
                    key,
                    uses: this.commandUsage[key]
                }))
                .sort((a, b) => b.uses - a.uses);

            cmds.push(...commands);
        }

        return cmds;
    }

    increment(cmd: Command) {
        if (!this.commandUsage[cmd.name]) this.commandUsage[cmd.name] = 0;

        this.commandsExecuted = this.commandsExecuted + 1;
        this.commandUsage[cmd.name] = this.commandUsage[cmd.name] + 1;
    }
}