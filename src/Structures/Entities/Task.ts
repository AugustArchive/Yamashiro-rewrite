import YamashiroClient from './Client';

interface TaskMeta {
    interval: number;
    name: string;
}
export default abstract class Task {
    public _timer?: NodeJS.Timer = undefined;
    public interval: number;
    public name: string;
    public bot: YamashiroClient;

    constructor(bot: YamashiroClient, meta: TaskMeta) {
        this.interval = meta.interval;
        this.name = meta.name;
        this.bot = bot;
    }

    public abstract run(): Promise<void>;
}