export {};
declare global {
    interface String {
        captialize(): string;
        elipisis(len?: number): string;
    }

    interface Array<T> {
        remove(item: T): T[];
        random(): T;
        trim(len?: number): T[];
        chunk(len?: number): T[];
        list(conj?: string): string;
        truncate(len?: number): T[];
    }

    interface Number {
        format(): string;
    }
}
