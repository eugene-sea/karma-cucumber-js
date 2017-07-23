/// <reference path="../typings/cucumber/cucumber.d.ts" />

'use strict';

module cucumber {
    export class CucumberHTMLListener implements ICucumberListener {
        private formatter: IDOMFormatter;

        constructor(rootElement: HTMLElement) {
            this.formatter = new CucumberHTML.DOMFormatter(rootElement);
        }

        hear(event: ICucumberEvent, defaultTimeout: number, callback: () => void): void {
            let eventName = event.getName();
            switch (eventName) {
                case 'BeforeFeature':
                    let feature = event.getPayload('feature');
                    this.formatter.uri(feature.getUri());
                    this.formatter.feature(CucumberHTMLListener.getDOMFormatterElement(feature));
                    break;

                case 'BeforeScenario':
                    let scenario = event.getPayload('scenario');
                    this.formatter.scenario(CucumberHTMLListener.getDOMFormatterElement(scenario));
                    break;

                case 'BeforeStep':
                    let step = event.getPayload('step');
                    this.formatter.step(CucumberHTMLListener.getDOMFormatterElement(step));
                    break;

                case 'StepResult':
                    let stepResult = event.getPayload('stepResult');
                    step = stepResult.getStep();
                    let result: IDOMFormatterStepResult;
                    const status = stepResult.getStatus();
                    if (status !== 'failed') {
                        result = { status: status };
                    } else {
                        let error = stepResult.getFailureException();
                        let errorMessage = typeof error === 'string' ? error : `${error.message}\n${error.stack}`;
                        result = { status: 'failed', error_message: errorMessage };
                    }

                    this.formatter.match({ uri: step.getUri(), step: { line: step.getLine() } });
                    this.formatter.result(result);
                    break;
            }

            callback();
        }

        private static getDOMFormatterElement(element: IFeatureElement): IDOMFormatterElement {
            return {
                keyword: element.getKeyword(),
                name: element.getName(),
                line: element.getLine(),
                description: !element.getDescription ? undefined : element.getDescription()
            };
        }
    }
}
