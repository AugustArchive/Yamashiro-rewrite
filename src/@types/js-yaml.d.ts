declare module 'js-yaml' {
    //* Exported Functions and Constants
    export function load<T>(content: string, options?: LoadOptions): T;
    export function load(content: string, options?: LoadOptions): any;
    export function safeLoad<T>(content: string, options?: LoadOptions): T;
    export function safeLoad(content: string, options?: LoadOptions): any;
    export function safeLoadAll(content: string, iterator?: (doc: any) => void | undefined, options?: LoadOptions): any[];
    export function safeLoadAll<T>(content: string, iterator?: (doc: any) => void | undefined, options?: LoadOptions): T[];
    export function loadAll(content: string, iterator?: (doc: any) => void | undefined, options?: LoadOptions): any[];
    export function loadAll<T>(content: string, iterator?: (doc: any) => void | undefined, options?: LoadOptions): T[];
    export function safeDump(obj: any, options?: DumpOptions): string;
    export function safeDump<T>(obj: T, options?: DumpOptions): string;
    export function dump(obj: any, options?: DumpOptions): string;
    export function dump<T>(obj: T, options?: DumpOptions): string;
    export let FAILSAFE_SCHEMA: Schema;
    export let JSON_SCHEMA: Schema;
    export let CORE_SCHEMA: Schema;
    export let DEFAULT_SAFE_SCHEMA: Schema;
    export let DEFAULT_FULL_SCHEMA: Schema;
    export let MINIMAL_SCHEMA: Schema;
    export let SAFE_SCHEMA: Schema;

    //* Exported Types and Classes
    export class Type {
        constructor(tag: string, options?: TypeConstructorOptions);

        public kind: 'sequence' | 'scalar' | 'mapping' | null;
        public instanceOf: object | null;
        public predicate: ((data: object) => boolean) | null;
        public represent: ((data: object) => any | { [x: string]: (data: object) => any }) | null;
        public defaultStyle: string | null;
        public styleAliases: { [x: string]: any };
        public resolve(data: any): boolean;
        public construct(data: any): any;
    }

    export class Schema implements SchemaDefinition {
        constructor(def: SchemaDefinition);

        static create(types: Type[] | Type): Schema;
        static create(schemas: Schema[] | Schema, types: Type[] | Type): Schema; // eslint-disable-line no-dupe-class-members
    }

    export interface LoadOptions {
        filename?: string;
        onWarning?(this: null, e: YAMLException): void;
        schema?: SchemaDefinition;
        json?: boolean;
    }

    export interface DumpOptions {
        indent?: number;
        noArrayIndent?: boolean;
	    skipInvalid?: boolean;
	    flowLevel?: number;
	    styles?: { [x: string]: any; };
	    schema?: SchemaDefinition;
	    sortKeys?: boolean | ((a: any, b: any) => number);
	    lineWidth?: number;
	    noRefs?: boolean;
	    noCompatMode?: boolean;
	    condenseFlow?: boolean;
    }

    export interface TypeConstructorOptions {
        kind?: 'sequence' | 'scalar' | 'mapping';
        resole?: (data: any) => boolean;
        construct?: (data: any) => any;
        instanceOf?: object;
        predicate?: (data: object) => boolean;
        represent?: ((data: object) => any) | { [x: string]: (data: object) => any };
        defaultStyle?: string;
        styleAliases?: { [x: string]: any; };
    }

    export interface SchemaDefinition {
        implicit?: any[];
        explicit?: Type[];
        include?: Schema[];
    }

    export class YAMLException extends Error {
        constructor(reason?: any, mark?: any);
        toString(compact?: boolean): string;
    }
}