/// <reference path="../typings/karma/karma.d.ts" />
/// <reference path="../typings/cucumber/cucumber.d.ts" />

'use strict';

module cucumber {
    export class CucumberKarmaListener implements ICucumberListener {
        private feature: IFeatureElement;
        private scenario: IFeatureElement;
        private totalSteps = 0;

        constructor(private karma: karma.IKarma) { }

        hear(event: ICucumberEvent, defaultTimeout: number, callback: () => void): void {
            let eventName = event.getName();
            switch (eventName) {
                case 'BeforeFeature':
                    this.feature = event.getPayload('feature');
                    break;

                case 'BeforeScenario':
                    this.scenario = event.getPayload('scenario');
                    break;

                case 'StepResult':
                    ++this.totalSteps;
                    this.karma.info({ total: this.totalSteps });

                    let stepResult = event.getPayload('stepResult');
                    let step = stepResult.getStep();
                    const suite = [this.feature.getName(), this.scenario.getName()];
                    const description = `${step.getKeyword()}${step.getName()}`;
                    const stepId = `${description} <- ${this.feature.getUri()}:${step.getLine()}`;
                    let result: karma.IKarmaResult = {
                        id: stepId,
                        description: description,
                        log: [],
                        suite: suite,
                        success: false,
                        skipped: false,
                        time: (stepResult.getDuration() || 0) / 1000000
                    };

                    switch (stepResult.getStatus()) {
                        case 'passed':
                            result.success = true;
                            break;
                        case 'pending':
                            result.skipped = true;
                            console.log(`Step is pending: ${suite.join(' -> ')} -> ${stepId}`);
                            break;
                        case 'undefined':
                            console.log(`Step is undefined: ${suite.join(' -> ')} -> ${stepId}`);
                        case 'skipped':
                            result.success = true;
                            result.skipped = true;
                            break;
                        case 'ambiguous':
                            const ambiguousStepDefinitions = stepResult.getAmbiguousStepDefinitions()
                                .map(s => `${s.getUri()} : ${s.getLine()}`);
                            result.log.push(`Step is ambiguous: ${stepId}\n${ambiguousStepDefinitions.join('\n')}`);
                            break;
                        default:
                            const error = stepResult.getFailureException();
                            const errorMessage = typeof error === 'string' ? error : error.stack;
                            result.log.push(`Step: ${stepId}\n${errorMessage}`);
                    }

                    this.karma.result(result);
                    break;
            }

            callback();
        }
    }
}
