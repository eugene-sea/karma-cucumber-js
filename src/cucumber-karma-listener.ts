/// <reference path="../typings/karma/karma.d.ts" />
/// <reference path="../typings/cucumber/cucumber.d.ts" />

'use strict';

module cucumber {
    export class CucumberKarmaListener implements ICucumberListener {
        private feature: IFeatureElement;
        private scenario: IFeatureElement;
        private totalSteps = 0;

        constructor(private karma: karma.IKarma) { }

        hear(event: ICucumberEvent, callback: () => void): void {
            let eventName = event.getName();
            switch (eventName) {
                case 'BeforeFeature':
                    this.feature = event.getPayloadItem('feature');
                    break;

                case 'BeforeScenario':
                    this.scenario = event.getPayloadItem('scenario');
                    break;

                case 'StepResult':
                    ++this.totalSteps;
                    this.karma.info({ total: this.totalSteps });

                    let stepResult = event.getPayloadItem('stepResult');
                    let step = stepResult.getStep();
                    let stepId = `${ step.getKeyword() }${ step.getName() } : ${ step.getLine() }`;
                    let result: karma.IKarmaResult = {
                        id: stepId,
                        description: '',
                        log: [],
                        suite: [this.feature.getName(), this.scenario.getName()],
                        success: false,
                        skipped: false,
                        time: (stepResult.getDuration() || 0) / 1000000
                    };
                    if (stepResult.isSuccessful()) {
                        result.success = true;
                    } else if (stepResult.isPending()) {
                        result.skipped = true;
                    } else if (stepResult.isUndefined() || stepResult.isSkipped()) {
                        result.success = true;
                        result.skipped = true;
                    } else {
                        let error = stepResult.getFailureException();
                        let errorMessage = typeof error === 'string' ? error : error.stack;
                        result.log.push(`Step: ${stepId}\n${errorMessage}`);
                    }

                    if (result.skipped) {
                        console.log(`Step is pending: ${stepId}`);
                    }

                    this.karma.result(result);
                    break;
            }

            callback();
        }
    }
}
