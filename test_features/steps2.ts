/// <reference path="../typings/cucumber/cucumber.d.ts" />

'use strict';

__adapter__.addStepDefinitions(scenario => {
    scenario.Given(/^there is an ambiguous test step$/, () => { });
});
