import { captureException } from '@sentry/node';
import YamashiroClient from '../Entities/Client';
import { readdir } from 'fs';
import { sep } from 'path';
import Logger from '../Logging/Logger';
import Event from '../Entities/Event';

export default class EventManager {
    public logger: Logger = new Logger();
    public path: string = `${process.cwd()}${sep}Events`;
    public bot: YamashiroClient;

    constructor(bot: YamashiroClient) {
        this.bot = bot;
    }

    start() {
        readdir(this.path, (error, files) => {
            if (error) {
                this.logger.error(`Unable to load events:\n${error}`);
                captureException(error);
                return;
            }

            this.logger.info(`Now loading ${files.length} events...`);
            files.forEach((file) => {
                const ctor = require(`${this.path}${sep}${file}`).default;
                const ev: Event = new ctor(this.bot);
                this.emit(ev);
            });
        });
    }

    emit(event: Event) {
        const wrapper = async(...args: any[]) => {
            try {
                await event.emit(...args);
            } catch(ex) {
                this.logger.error(`Unable to run the "${event.event}" event:\n${ex}`);
            }
        };

        this.bot.on(event.event, wrapper);
    }
}