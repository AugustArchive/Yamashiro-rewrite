declare module 'table' {
    export function table(data: string[][], config?: TableConfig): string;
    export function createStream(config: TableConfig): { write: string[] };
    export function getBorderCharacters(name: 'honeywell' | 'norc' | 'ramac' | 'void'): JoinStructure;

    interface Column {
        alignment?: 'left' | 'center' | 'right';
        paddingLeft?: number;
        paddingRight?: number;
        truncate?: number;
        width?: number;
        wrapWord?: boolean;
    }

    interface JoinStructure {
        topBody?: string;
        topJoin?: string;
        topLeft?: string;
        topRight?: string;
        bottomBody?: string;
        bottomJoin?: string;
        bottomLeft?: string;
        bottomRight?: string;
        bodyLeft?: string;
        bodyRight?: string;
        bodyJoin?: string;
        joinBody?: string;
        joinLeft?: string;
        joinRight?: string;
        joinJoin?: string;
    }

    interface TableConfig {
        columns?: { [x: number]: Column; };
        drawHorizontalLine?: (i: number, size: number) => boolean;
        border?: JoinStructure;
        columnDefault?: Column;
        columnCount?: number;
        singleLine?: boolean;
    }
}