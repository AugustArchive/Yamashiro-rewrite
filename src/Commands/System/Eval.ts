import { createProgram, getPreEmitDiagnostics, ScriptTarget, ModuleResolutionKind, ModuleKind, transpileModule } from 'typescript';
import { writeFileSync, existsSync, mkdirSync, unlinkSync } from 'fs';
import { YamashiroClient, Command, Context } from '../../Structures';
import { DiscordEmoji } from '../../Utils/Constants';
import { inspect } from 'util';
import { post } from 'wumpfetch';
import { sep } from 'path';

interface HastebinResult {
    key: string;
}

class TypeScriptCompliationError extends Error {
    public name: string = 'CompliationError';
    constructor(msg: string) {
        super(msg);
    }
}

export default class extends Command {
    constructor(bot: YamashiroClient) {
        super(bot, {
            name: 'eval',
            description: 'Evaluates JavaScript or TypeScript code and returns the value',
            moduleID: 'system',
            ownerOnly: true
        });
    }

    async run(ctx: Context) {
        if (ctx.args.isEmpty(0)) return void ctx.send(`${DiscordEmoji.ERROR} **| Commander, you will need to provide a script.**`);

        let script    = ctx.args.join(' ');
        const started = Date.now();

        const slient  = ctx.flags.get('slient');
        const isAsync = (script.includes('await') || script.includes('return'));
        const typescr = ctx.flags.get('ts');

        if (slient && typeof slient === 'string') return void ctx.send(`${DiscordEmoji.ERROR} **| The "slient" flag needs to be like: \`--slient\`.**`);
        if (typescr && typeof typescr === 'string') return void ctx.send(`${DiscordEmoji.ERROR} **| The "ts" flag needs to be like: \`--ts\`.**`);
    
        if (typescr) script = script.replace(/--ts/, '');
        if (slient) script = script.replace(/--slient/, '');

        let result!: string;
        try {
            //* If they provided the "--ts" flag
            if (typescr) {
                const code = this._compile(script);
                result = isAsync? eval(`(async() => {${code}})()`): eval(code);
            } else {
                result = isAsync? eval(`(async() => {${script}})()`): eval(script);
            }

            if ((result as any) instanceof Promise) result = await result;
            if (typeof result !== 'string') result = inspect(result, {
                depth: +!(inspect(result, { depth: 1 })),
                showHidden: true
            });

            const res = this._redact(result);
            if (res.length > 1996) {
                try {
                    const _res = (await post('https://hastebin.com/documents', {
                        data: res
                    }).send());
                    const data = _res.json<HastebinResult>();
                    return void ctx.send(`:link: **| Result was too long. <https://hastebin.com/${data.key}.js>**`);
                } catch {
                    return void ctx.send(`${DiscordEmoji.ERROR} **| Result was too long but was unable to post to Hastebin. :(**`);
                }
            }

            if (slient) return;
            return void ctx.embed(
                this
                    .bot
                    .getEmbed()
                    .setAuthor('| Evaluation Result (Success)', undefined, this.bot.avatar)
                    .setDescription(`\`\`\`js\n${res}\`\`\``)
                    .setFooter(`Time: ${Date.now() - started}ms`)
                    .build()
            );
        } catch(ex) {
            if (slient) return;
            return void ctx.embed(
                this
                    .bot
                    .getEmbed()
                    .setAuthor('| Evaluation Result (Unsuccessful)', undefined, this.bot.avatar)
                    .setDescription(`\`\`\`js\n${ex}\`\`\``)
                    .setFooter(`Time: ${Date.now() - started}ms`)
                    .build()
            );
        }
    }

    private _redact(result: string) {
        const cancellationToken = new RegExp([
            this.bot.token,
            this.bot.config.discord.token,
            this.bot.config.redis.host,
            this.bot.config.apis.august,
            this.bot.config.apis.builder,
            this.bot.config.apis.chewey,
            this.bot.config.apis.omdb,
            this.bot.config.apis.ppy,
            this.bot.config.botlists.bfd,
            this.bot.config.botlists.luke,
            this.bot.config.botlists.oliy,
            this.bot.config.botlists.unto,
            this.bot.config.botlists.mythical
        ].join('|'), 'gi');

        return result.replace(cancellationToken, '--snip--');
    }

    private _compile(code: string) {
        const filename = `${process.cwd()}${sep}Data${sep}Evaluations${sep}${Date.now()}.ts`;
        if (!existsSync(`${process.cwd()}${sep}Data`)) {
            mkdirSync(`${process.cwd()}${sep}Data`);
            mkdirSync(`${process.cwd()}${sep}Data${sep}Evaluations`);
        }

        writeFileSync(filename, code);

        //* Make a "ts.Program" file to get diagnostics from
        const program = createProgram([filename], {
            target: ScriptTarget.ESNext,
            module: ModuleKind.CommonJS,
            declaration: false,
            strict: true,
            noImplicitAny: false,
            moduleResolution: ModuleResolutionKind.NodeJs,
            allowSyntheticDefaultImports: true,
            esModuleInterop: true,
            experimentalDecorators: true,
            emitDeclarationMetadata: true,
            resolveJsonModule: true,
            //* Compile from ES2015 -> ESNext to Common (Vanilla JavaScript)
            lib: [
                'lib.es2015.d.ts',
                'lib.es2016.d.ts',
                'lib.es2017.d.ts',
                'lib.es2018.d.ts',
                'lib.esnext.d.ts'
            ]
        });

        const diagnostics = getPreEmitDiagnostics(program);
        let message!: string;
        if (diagnostics.length) {
            for (const diagnostic of diagnostics) {
                console.log(diagnostic);
                const _msg  = diagnostic.messageText;
                const _file = diagnostic.file;
                const line  = _file? _file.getLineAndCharacterOfPosition(diagnostic.start!): undefined;

                //* If the diagonstic is undefined, get the message from "messageText"
                if (line === undefined) {
                    message = _msg.toString();
                    break;
                }

                const _line = line.line + 1;
                const _char = line.character + 1;
                message = `${_msg} (at "${_line}:${_char}")`;
            }
        }

        unlinkSync(filename);
        if (message) throw new TypeScriptCompliationError(message);

        const transpiled = transpileModule(code, {
            compilerOptions: {
                target: ScriptTarget.ESNext,
                module: ModuleKind.CommonJS,
                declaration: false,
                strict: true,
                noImplicitAny: false,
                moduleResolution: ModuleResolutionKind.NodeJs,
                allowSyntheticDefaultImports: true,
                esModuleInterop: true,
                experimentalDecorators: true,
                emitDeclarationMetadata: true,
                resolveJsonModule: true,
                //* Compile from ES2015 -> ESNext to Common (Vanilla JavaScript)
                lib: [
                    'lib.es2015.d.ts',
                    'lib.es2016.d.ts',
                    'lib.es2017.d.ts',
                    'lib.es2018.d.ts',
                    'lib.esnext.d.ts'
                ]
            }
        });

        return transpiled
            .outputText
            .replace('"use strict";\r\nexports.__esModule = true;\r\n', '');
    }
}