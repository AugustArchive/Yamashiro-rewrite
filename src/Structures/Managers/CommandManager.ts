import { readdir, readdirSync } from 'fs';
import { captureException } from '@sentry/node';
import YamashiroClient from '../Entities/Client';
import { Collection } from '@augu/immutable';
import Command from '../Entities/Command';
import { sep } from 'path';
import Module from '../Entities/Module';
import Logger from '../Logging/Logger';

export default class CommandManager {
    public commands: Collection<Command>;
    public modules: Collection<Module>;
    public logger: Logger = new Logger();
    public path: string = `${process.cwd()}${sep}Commands`;
    public bot: YamashiroClient;

    constructor(bot: YamashiroClient) {
        this.commands = new Collection('commands');
        this.modules  = new Collection('modules');
        this.bot      = bot;
    }

    async start() {
        const _modules = readdirSync(this.path);
        this.logger.info(`Now loading ${_modules.length} modules!`);
        for (const moduleID of _modules) {
            const id = moduleID.toLowerCase();
            const mod = new Module(this.bot, id);
            if (!this.modules.has(id)) this.modules.set(id, mod);

            readdir(`${this.path}${sep}${moduleID}`, (error, files) => {
                if (error) {
                    this.logger.error(`Unable to load commands:\n${error}`);
                    captureException(error);
                }

                if (!files.length) {
                    this.modules.delete(id);
                    this.logger.warn(`Module "${id}" has no commands! I have deleted it~`);
                    return;
                }

                this.logger.info(`Now loading ${files.length} commands in the ${moduleID} module...`);
                for (let i = 0; i < files.length; i++) {
                    try {
                        const file = files[i];
                        const ctor = require(`${this.path}${sep}${moduleID}${sep}${file}`);
                        const cmd: Command = new ctor.default(this.bot);

                        if (this.commands.has(cmd.name)) {
                            this.logger.warn(`Command "${cmd.name}" already exists! Continuing process...`);
                            continue;
                        }

                        this.commands.set(cmd.name, cmd);
                        mod.commands.set(cmd.name, cmd);
                        this.logger.info(`Loaded command "${cmd.name}"`);
                    } catch(ex) {
                        this.logger.error(`Unable to load ${files[i]}:\n${ex}`);
                        captureException(ex);
                        continue;
                    }
                }
            });
        }
    }
}