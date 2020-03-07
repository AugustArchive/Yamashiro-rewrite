export default class ArgumentParser {
    private args: string[];
    constructor(raw: string[]) {
        this.args = [];
        for (const arg of raw) {
            //* Remove all flags
            if (!arg.startsWith('--') || !arg.startsWith('-')) this.args.push(arg);
        }
    }

    get(index: number) {
        return this.args[index];
    }

    isEmpty(index: number) {
        return !this.args[index];
    }

    join(sep: string = ' ') {
        return this.args.join(sep);
    }

    slice(arg: number, start?: number, end?: number) {
        const _arg = this.get(arg);
        return _arg.slice(start, end);
    }

    sliceAll(start?: number, end?: number) {
        return this.args.slice(start, end);
    }

    get raw() {
        return this.args;
    }
}