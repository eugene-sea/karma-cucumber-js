/// <reference path="../../typings/cucumber/cucumber.d.ts" />
/// <reference path="../../typings/should/should.d.ts" />

'use strict';

import { exec } from 'child_process';
import * as should from 'should';

require('source-map-support').install();

class World {
    karmaOutput = '';
    constructor(callback: () => void) { callback(); }
}

export = function() {
    let scenario: cucumber.IScenario = this;

    scenario.World = World;

    scenario.Given(
        /^I have several features with (\d+) passing steps, (\d+) pending and (\d+) failing$/,
        (passing: number, pending: number, failing: number) => { });

    scenario.Given(/^Karma is configured to test these features$/, () => { });

    scenario.Given(/^one passing scenario has "([^"]*)" tag$/, (tag: string, callback: cucumber.IStepCallback) => {
        callback.pending();
    });

    scenario.Given(/^one pending scenario has "([^"]*)" tag$/, (tag: string, callback: cucumber.IStepCallback) => {
        callback.pending();
    });

    scenario.Given(
        /^Karma is configured to test scenarios of "([^"]*)" tag only$/,
        (tag: string, callback: cucumber.IStepCallback) => {
            callback.pending();
        });

    scenario.When(/^I run Karma$/, (callback: cucumber.IStepCallback) => {
        exec('./node_modules/.bin/karma start', (error: Error, stdout: Buffer, stderr: Buffer) => {
            let world = <World>this;
            // console.log(stdout);
            world.karmaOutput = stdout.toString();
            callback();
        });
    });

    scenario.Then(
        /^Karma reports the following steps counts:$/,
        (table: cucumber.IStepTable) => {
            let world = <World>this;
            let res = /.*Executed (\d+) of 1 \((\d+) FAILED\) \(skipped (\d+)\) \(\d+(?:.\d+)? secs \/ \d+(?:.\d+)? sec(?:s)?\)\s*$/g.exec(world.karmaOutput);

            should.exist(res);

            should.exists(res[1]);
            Number(res[1]).should.equal(Number(table.hashes()[0].Passed) + Number(table.hashes()[0].Failed));

            should.exists(res[2]);
            res[2].should.equal(table.hashes()[0].Failed);

            should.exists(res[3]);
            res[3].should.equal(table.hashes()[0].Skipped);
        });
}
