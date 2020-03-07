import { User, Member } from 'eris';

//* Arrays
Array.prototype.remove = function <T>(item: T): T[] {
    for (let i = 0; i < this.length; i++) {
        if (this[i] === item) this.splice(i, 1);
    }

    return this;
};

Array.prototype.random = function <T>(): T {
    return this[Math.floor(Math.random() * this.length)];
};

// credit: https://github.com/dragonfire535/xiao/blob/master/util/Util.js#L34-L41
Array.prototype.trim = function <T>(len: number = 10) {
    let splice: any[] = [];
    //* push everything to the "splice" array
    this.map(s => splice.push(s));

    if (splice.length > len) {
        const length = this.length - len;
        splice = this.slice(0, length);
        splice.push(`${len} more...`);
    }

    return splice;
};

// credit: https://github.com/dragonfire535/xiao/blob/master/util/Util.js#L21-L24
Array.prototype.list = function(conj: string = 'and') {
    const length = this.length;
    return `${this.slice(0, -1).join(', ')}${length > 1? `${length > 2? ', ': ''} ${conj} `: ''}${this.slice(-1)}`;
};

Array.prototype.chunk = function <T>(len: number) {
    let size = Math.max(len, 0);
    let c: T[][] = [];
    let i = 0;

    while (i < this.length) c.push(this.slice(i, i += len));
    return c;
};

Array.prototype.truncate = function(len: number = 25) {
    const arr = this.slice(0, len);
    if (this.length > len) {
        const prev = this.length - len;
        arr.push('[...]');
        return arr;
    }

    return arr;
};

//* Strings
String.prototype.elipisis = function(len: number = 2000) {
    return this.length > len? `${this.substr(0, len - 3)}...`: this.toString();
};

String.prototype.captialize = function() {
    const char = this.charAt(0);
    return `${char.toUpperCase()}${this.slice(1)}`;
};

//* Numbers
Number.prototype.format = function() {
    return this.toLocaleString(undefined, { maximumFractionDigits: 2 });
};

//* Eris
Object.defineProperty(Member.prototype, 'tag', {
    get: function() {
        const self = (this as Member);
        return `${self.username}#${self.discriminator}`;
    }
});

Object.defineProperty(User.prototype, 'tag', {
    get: function() {
        const self = (this as User);
        return `${self.username}#${self.discriminator}`;
    }
});