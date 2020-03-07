import colors, { rgbBg } from './Colors';
import { inspect } from 'util';

type MessageType = (string | object);
export default class Logger {
    public colors: typeof colors = colors;

    private formatTime() {
        const now = new Date();
        const suffix = now.getHours() >= 12? 'PM': 'AM';
        const hours = now.getHours() >= 12? now.getHours(): `0${now.getHours()}`;
        const minutes = now.getMinutes() >= 12? now.getMinutes(): `0${now.getMinutes()}`;
        const seconds = now.getSeconds() >= 12? now.getSeconds(): `0${now.getSeconds()}`;
        return `[${hours}:${minutes}:${seconds}${suffix}]`;
    }
    
    private get time() {
        const prefix = this.formatTime();
        return this.colors.bgBlue(prefix);
    }

    private _convertText(message: MessageType) {
        return typeof message === 'object'? inspect(message): message as string;
    }

    info(message: MessageType) {
        const text = this._convertText(message);
        process.stdout.write(`${this.time} ${this.colors.bgMagenta(`[INFO/${process.pid}]`)} ~> ${text}\n`);
    }

    error(message: MessageType) {
        const text = this._convertText(message);
        process.stdout.write(`${this.time} ${this.colors.bgRed(`[ERROR/${process.pid}]`)} ~> ${text}\n`);
    }

    warn(message: MessageType) {
        const text = this._convertText(message);
        process.stdout.write(`${this.time} ${this.colors.bgYellow(`[WARN/${process.pid}]`)} ~> ${text}\n`);
    }

    debug(message: MessageType) {
        const text = this._convertText(message);
        process.stdout.write(`${this.time} ${this.colors.bgGrey(`[DEBUG/${process.pid}]`)} ~> ${text}\n`);
    }

    discord(message: MessageType) {
        const text  = this._convertText(message);
        process.stdout.write(`${this.time} ${rgbBg([114, 137, 218], `[DISCORD/${process.pid}]`)} ~> ${text}\n`);
    }

    mongodb(message: MessageType) {
        const text  = this._convertText(message);
        process.stdout.write(`${this.time} ${rgbBg([88, 150, 54], `MONGODB/${process.pid}`)} ~> ${text}\n`);
    }
}