/// <reference path="../typings/cucumber/cucumber.d.ts" />

'use strict';

__adapter__.addStepDefinitions(scenario => {
    scenario.Given(/^there is a test step$/, () => { });
    scenario.When(/^it is executed$/, () => { });
    scenario.When(/^it is not executed$/, (callback: cucumber.IStepCallback) => callback(null, 'pending'));
    scenario.Then(/^test succeeds$/, () => { });
    scenario.Then(/^test fails$/, (callback: cucumber.IStepCallback) => callback(new Error('Step failed')));
});
