declare module cucumber {
    export interface ICucumber {
        start(callback: () => void): void;
        attachListener(listener: ICucumberListener): void;
    }

    export interface IDOMFormatterElement {
        keyword: string;
        name: string;
        line: number;
        description?: string;
    }

    export interface IDOMFormatterStepResult {
        status: string;
        error_message?: string;
    }

    export interface IDOMFormatter {
        uri(featureUri: string): void;
        feature(feature: IDOMFormatterElement): void;
        scenario(scenario: IDOMFormatterElement): void;
        step(scenario: IDOMFormatterElement): void;
        result(result: IDOMFormatterStepResult): void;
        match(stepInfo: { uri: string; step: { line: number; }; }): void;
    }

    export interface IFeatureElement {
        getUri(): string;
        getKeyword(): string;
        getName(): string;
        getLine(): number;
        getDescription?(): string;
    }

    export interface IStepResult {
        getStatus(): string;
        getStep(): IFeatureElement;
        getFailureException(): string | { stack: string; };
        getDuration(): number;
    }

    export interface ICucumberEvent {
        getName(): string;
        getPayloadItem(item: 'stepResult'): IStepResult;
        getPayloadItem(item: 'feature'): IFeatureElement;
        getPayloadItem(item: 'scenario'): IFeatureElement;
        getPayloadItem(item: 'step'): IFeatureElement;
        getPayloadItem(item: string): any;
    }

    export interface ICucumberListener {
        hear(event: ICucumberEvent, callback: () => void): void;
    }

    export interface IStepCallback {
        (error?: Error): void;
        pending(): void;
    }

    export interface IStepTable {
        getRows(): string[];
        rows(): string[][];
        hashes(): any[];
        rowsHash(): { [key: string]: string; };
    }

    export interface IScenario {
        World: { new (): any };
        Given(regExp: RegExp, callback: Function): void;
        When(regExp: RegExp, callback: Function): void;
        Then(regExp: RegExp, callback: Function): void;
    }

    export interface IKarmaCucumberAdapter {
        addStepDefinitions(callback: (scenario: cucumber.IScenario) => void): void;
    }
}

declare var Cucumber: {
    new (features: [string, string][], stepDefinitions: () => void, options?: { tags: string[]; }): cucumber.ICucumber;
};
declare var CucumberHTML: { DOMFormatter: { new (rootElement: HTMLElement): cucumber.IDOMFormatter; } };

declare var __adapter__: cucumber.IKarmaCucumberAdapter;