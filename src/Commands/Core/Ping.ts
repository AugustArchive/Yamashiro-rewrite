import { YamashiroClient, Command, Context } from '../../Structures';

export default class extends Command {
    constructor(bot: YamashiroClient) {
        super(bot, {
            name: 'ping',
            description: 'Shows the bot\'s latency from Discord',
            moduleID: 'core',
            aliases: ['pong'],
            guarded: true
        });
    }

    get vowel() {
        return ['a', 'e', 'i', 'o', 'u'].random();
    }

    async run(ctx: Context) {
        return void ctx.send(`:ping_pong: **| P${this.vowel}ng! ${ctx.guild.shard.latency}ms**`);
    }
}