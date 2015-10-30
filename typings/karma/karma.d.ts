declare module karma {
    export interface IKarmaResult {
        id: string;
        description: string;
        log: string[];
        suite: string[];
        success: boolean;
        skipped: boolean;
        time: number;
    }

    export interface IKarma {
        start: () => void;
        files: { [file: string]: string; };
        config: { args: string[]; };
        info(info: { total: number; }): void;
        complete(info: { coverage: any }): void;
        result(info: IKarmaResult): void;
    }

    export interface IKarmaReporter {
        onSpecComplete(browser: any, result: IKarmaResult): void;
        onRunComplete(): void;
    }
}

declare var __karma__: karma.IKarma;