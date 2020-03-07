import { YamashiroClient, Command, Context } from '../../Structures';
import { DiscordEmoji } from '../../Utils/Constants';
import { exec } from 'child_process';

export default class extends Command {
    constructor(bot: YamashiroClient) {
        super(bot, {
            name: 'shell',
            description: 'Executes a terminal-like command',
            moduleID: 'system',
            ownerOnly: true,
            usage: '<script>',
            aliases: ['exec', 'term', '$', 'sh', 'terminal']
        });
    }

    async run(ctx: Context) {
        if (ctx.args.isEmpty(0)) return void ctx.send(`${DiscordEmoji.ERROR} **| Commander, you need to provide a script.**`);

        const script  = ctx.args.join(' ');
        const message = await ctx.send(`${DiscordEmoji.OK} **| Now evaluating:**`, 
            this
                .bot
                .getEmbed()
                .setDescription(`\`\`\`sh\n${script}\`\`\``)
                .build()
        );

        exec(script, async(error, stdout, stderr) => {
            if (error) {
                await message.delete();
                return void ctx.embed(
                    this
                        .bot
                        .getEmbed()
                        .setAuthor('| Evaluation Result (Unsuccessful)', undefined, this.bot.avatar)
                        .setDescription(`\`\`\`sh\n${stderr}\`\`\``)
                        .build()
                );
            }

            await message.delete();
            return void ctx.embed(
                this
                    .bot
                    .getEmbed()
                    .setAuthor('| Evaluation Result (Successful)', undefined, this.bot.avatar)
                    .setDescription(`\`\`\`sh\n${stdout}\`\`\``)
                    .build()
            );
        });
    }
}