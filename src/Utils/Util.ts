export default class Util {
    static parseMemory(bytes: number) {
        const kb = bytes / 1024;
        const mb = kb / 1024;
        const gb = mb / 1024;

        if (kb < 1024) return `${kb.toFixed(2)}KB`;
        if (kb > 1024 && mb < 1024) return `${mb.toFixed(2)}MB`;
        return `${gb.toFixed(2)}GB`;
    }

    //* credit: Ene (closed source)
    static toMicrotime() {
        const time = process.hrtime();
        return time[0] * 1000000 + time[1] / 1000;
    }
}