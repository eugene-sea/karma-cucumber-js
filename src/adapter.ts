/// <reference path="../typings/karma/karma.d.ts" />
/// <reference path="../typings/cucumber/cucumber.d.ts" />
/// <reference path="./cucumber-html-listener.ts" />
/// <reference path="./cucumber-karma-listener.ts" />

'use strict';

module karma {
    export class CucumberAdapter {
        private stepDefinitionsCallbacks: ((scenario: cucumber.IScenario) => void)[] = [];

        constructor(private karma: IKarma) { }

        getStart(): () => void {
            return () => {
                let featuresUrls = Object.keys(this.karma.files).filter(f => /\.feature$/.test(f));
                console.log(`Found features: ${featuresUrls.join(', ')}`);

                let tags = CucumberAdapter.getTags(this.karma.config.args);
                console.log(`Tags: ${tags.join(', ')}`);
                let features = CucumberAdapter.loadFeatures(featuresUrls);
                let cucumberReporterNode = CucumberAdapter.createCucumberReporterNode();
                this.runFeatures(features, tags, cucumberReporterNode);
            };
        }

        addStepDefinitions(callback: (scenario: cucumber.IScenario) => void): void {
            this.stepDefinitionsCallbacks.push(callback);
        }

        private static loadFeatures(featuresUrls: string[]): [string, string][] {
            let res: [string, string][] = [];
            return featuresUrls.map(f => <[string, string]>[f, CucumberAdapter.loadFile(f)]);
        }

        private static loadFile(url: string): string {
            let client = new XMLHttpRequest();
            client.open("GET", url, false);
            client.send();
            return client.responseText;
        }

        private static createCucumberReporterNode(): HTMLDivElement {
            let cucumberReporterNode = document.createElement('div');
            cucumberReporterNode.className = 'cucumber-report';
            document.body.appendChild(cucumberReporterNode);
            return cucumberReporterNode;
        }

        private static getTags(args: string[]): string[] {
            let tagsIndex = args.indexOf('--tags');
            if (tagsIndex < 0) {
                return [];
            }

            let lastTagsIndex = args.indexOf('--', tagsIndex + 1);
            return args.slice(tagsIndex + 1, lastTagsIndex < 0 ? args.length : lastTagsIndex).filter(s => !!s);
        }

        private runFeatures(features: [string, string][], tags: string[], rootElement: HTMLElement): void {
            let self = this;
            let cucumberInstance = new Cucumber(
                features, function () {
                    let scenario: cucumber.IScenario = <any>this; // Supplied by Cucumber
                    self.stepDefinitionsCallbacks.forEach(c => c(scenario));
                }, { tags: tags }
            );
            cucumberInstance.attachListener(new cucumber.CucumberHTMLListener(rootElement));
            cucumberInstance.attachListener(new cucumber.CucumberKarmaListener(this.karma));

            // cucumberInstance.start(() => { });
            cucumberInstance.start(() => this.karma.complete({ coverage: (<any>window).__coverage__ }));
        }
    }
}

var __adapter__: cucumber.IKarmaCucumberAdapter;
(() => {
    let adapter = new karma.CucumberAdapter(__karma__)
    __adapter__ = adapter;
    __karma__.start = adapter.getStart();
})();
