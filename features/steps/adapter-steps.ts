/// <reference path="../../typings/cucumber/cucumber.d.ts" />
/// <reference path="../../typings/should/should.d.ts" />

'use strict';

import { exec } from 'child_process';
import * as should from 'should';

import * as fs from 'fs';

require('source-map-support').install();

class World {
    karmaOutput = '';
    tags: string[] = [];
    constructor() {
        try {
            fs.unlinkSync('results.json');
        } catch (error) {
            if (error.code !== 'ENOENT') {
                throw error;
            }
        }
    }
}

export = function() {
    let scenario: cucumber.IScenario = this;

    scenario.World = World;

    scenario.Given(
        /^I have several features with (\d+) passing steps, (\d+) pending and (\d+) failing$/,
        (passing: number, pending: number, failing: number) => { });

    scenario.Given(/^Karma is configured to test these features$/, () => { });

    scenario.Given(/^one passing scenario has "([^"]+)" tag$/, (tag: string) => { });

    scenario.Given(/^one pending scenario has "([^"]+)" tag$/, (tag: string) => { });

    scenario.Given(
        /^Karma is configured to test scenarios of "([^"]+)" tag$/,
        function(tag: string) {
            let world = <World>this;
            world.tags.push(tag);
        });

    scenario.When(/^I run Karma$/, function(callback: cucumber.IStepCallback) {
        let world = <World>this;
        exec(
            `env KARMA_CLIENT_ARGS="--tags ${ world.tags.join(' ') }" ./node_modules/.bin/karma start`,
            (error: Error, stdout: Buffer, stderr: Buffer) => {
                console.log(stdout);
                world.karmaOutput = stdout.toString();
                callback();
            });
    });

    scenario.Then(
        /^Karma reports the following steps counts:$/,
        function(table: cucumber.IStepTable) {
            let world = <World>this;
            if (table.hashes()[0].Failed === '0') {
                let res = /.*Executed (\d+) of 1 \(skipped (\d+)\) SUCCESS \(\d+(?:.\d+)? secs \/ \d+(?:.\d+)? sec(?:s)?\)\s*$/g.exec(world.karmaOutput);

                should.exist(res);

                should.exist(res[1]);
                res[1].should.equal(table.hashes()[0].Passed);

                should.exist(res[2]);
                res[2].should.equal(table.hashes()[0].Skipped);
            } else {
                let res = /.*Executed (\d+) of 1 \((\d+) FAILED\) \(skipped (\d+)\) \(\d+(?:.\d+)? secs \/ \d+(?:.\d+)? sec(?:s)?\)\s*$/g.exec(world.karmaOutput);

                should.exist(res);

                should.exist(res[1]);
                Number(res[1]).should.equal(Number(table.hashes()[0].Passed) + Number(table.hashes()[0].Failed));

                should.exist(res[2]);
                res[2].should.equal(table.hashes()[0].Failed);

                should.exist(res[3]);
                res[3].should.equal(table.hashes()[0].Skipped);
            }

            should.exist(fs.statSync('results.json'));
        });
}
