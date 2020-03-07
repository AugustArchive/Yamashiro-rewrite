//* stolen from Nino
type FlagMap = { [x: string]: string | boolean };
export default class FlagParser {
    private flags: string;
    constructor(raw: string[]) {
        this.flags = raw.join(' ');
    }

    parse() {
        const parsed: FlagMap = {};
        if (!this.flags.includes('--') || !this.flags.includes('-')) return {};

        const toSlice = this.flags.includes('--')? this.flags.split('--'): this.flags.split('-');
        for (let flag of toSlice.slice(1)) {
            if (flag === '' || !flag.includes('=') || flag[0] === '=' || flag[flag.length - 1] === '=') {
                const name = flag.split(' ')[0];
                parsed[name] = true;
                continue;
            }

            const name = flag.split('=')[0];
            const val  = flag.slice(flag.indexOf('=') + 1).trim();
            parsed[name] = val;
        }

        return parsed;
    }

    get(flag: string) {
        const flags = this.parse();
        return flags[flag];
    }
}