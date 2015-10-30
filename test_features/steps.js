/// <reference path="../typings/cucumber/cucumber.d.ts" />
'use strict';
__adapter__.addStepDefinitions(function (scenario) {
    scenario.Given(/^there is a test step$/, function () { });
    scenario.When(/^it is executed$/, function () { });
    scenario.When(/^it is not executed$/, function (callback) { return callback.pending(); });
    scenario.Then(/^test succeeds$/, function () { });
    scenario.Then(/^test fails$/, function (callback) { return callback(new Error('Step failed')); });
});
//# sourceMappingURL=steps.js.map