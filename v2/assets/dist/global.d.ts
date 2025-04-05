export type Nullable<T> = T | undefined | null;
export declare class EventEmitter {
    private events;
    hasEvents(event: string): boolean;
    on(event: string, listener: (...parameters: any[]) => void): this;
    removeListener(event: string, listener: (...parameters: any[]) => void): void;
    emit(event: string, ...parameters: any[]): void;
    once(event: string, listener: (...parameters: any[]) => void): void;
}
export interface ClientSettings {
    debug: boolean;
    params: URLSearchParams;
    host: string;
    port: number;
    users: string[];
    spriteTemplate: HandlebarsTemplateDelegate;
}
export declare let indexOf: (haystack: Array<any>, needle: any) => number;
export declare function string2ColHex(input: string): string;
export declare const typeColors: {
    [key: string]: string;
};
export declare const statusColors: {
    [key: string]: string;
};
export declare const htmlColors: {
    [key: string]: string;
};
