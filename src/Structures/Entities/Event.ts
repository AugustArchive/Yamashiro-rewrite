import YamashiroClient from './Client';

export default abstract class Event {
    public bot: YamashiroClient;
    public event: string;

    constructor(bot: YamashiroClient, event: string) {
        this.event = event;
        this.bot   = bot;
    }

    public abstract emit(...args: any[]): Promise<void>;
}