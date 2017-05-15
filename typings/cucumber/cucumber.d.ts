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

    export interface IStepDefinition {
        getUri(): string;
        getLine(): number;
    }

    export interface IStepResult {
        getStatus(): string;
        getStep(): IFeatureElement;
        getFailureException(): string | { stack: string; };
        getDuration(): number;
        getAmbiguousStepDefinitions(): IStepDefinition[];
    }

    export interface ICucumberEvent {
        getName(): string;
        getPayload(item: 'stepResult'): IStepResult;
        getPayload(item: 'feature'): IFeatureElement;
        getPayload(item: 'scenario'): IFeatureElement;
        getPayload(item: 'step'): IFeatureElement;
        getPayload(item: string): any;
    }

    export interface ICucumberListener {
        hear(event: ICucumberEvent, defaultTimeout: number, callback: () => void): void;
    }

    export interface IStepCallback {
        (error?: Error, reason?: 'pending'): void;
        (error?: Error, reason?: string): void;
    }

    export interface IStepTable {
        getRows(): string[];
        rows(): string[][];
        hashes(): any[];
        rowsHash(): { [key: string]: string; };
    }

    export interface IScenario {
        World: { new (): any };
        setDefaultTimeout(timeout: number): void;
        Before(callback: Function): void;
        Before(tag: string, callback: Function): void;
        Before(options: { tags: string[] }, callback: Function): void;
        After(callback: Function): void;
        After(tag: string, callback: Function): void;
        After(options: { tags: string[] }, callback: Function): void;
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