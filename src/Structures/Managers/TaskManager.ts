import { captureException } from '@sentry/node';
import YamashiroClient from '../Entities/Client';
import { Collection } from '@augu/immutable';
import { readdir } from 'fs';
import { sep } from 'path';
import Logger from '../Logging/Logger';
import Task from '../Entities/Task';

export default class TaskManager extends Collection<Task> {
    public logger: Logger = new Logger();
    public path: string = `${process.cwd()}${sep}Tasks`;
    public bot: YamashiroClient;

    constructor(bot: YamashiroClient) {
        super('tasks');

        this.bot = bot;
    }

    start() {
        readdir(this.path, (error, files) => {
            if (error) {
                this.logger.error(`Unable to build tasks:\n${error}`);
                captureException(error);
                return;
            }

            this.logger.info(`Now building ${files.length} tasks...`);
            files.forEach((file) => {
                const ctor = require(`${this.path}${sep}${file}`).default;
                const task: Task = new ctor(this.bot);

                if (this.has(task.name)) {
                    this.logger.warn(`Task "${task.name}" is already in the collection! Continuing process...`);
                    return;
                }
                
                this.set(task.name, task);
                this.logger.info(`Loaded task "${task.name}"~`);
            });
        });
    }
}