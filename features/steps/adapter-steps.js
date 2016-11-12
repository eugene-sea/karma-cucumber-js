/// <reference path="../../typings/cucumber/cucumber.d.ts" />
'use strict';
var child_process_1 = require("child_process");
var should = require("should");
var fs = require("fs");
require('source-map-support').install();
var World = (function () {
    function World() {
        this.karmaOutput = '';
        this.tags = [];
        try {
            fs.unlinkSync('results.json');
        }
        catch (error) {
            if (error.code !== 'ENOENT') {
                throw error;
            }
        }
    }
    return World;
}());
module.exports = function () {
    var scenario = this;
    scenario.setDefaultTimeout(15 * 1000);
    scenario.World = World;
    scenario.Given(/^I have several features with (\d+) passing steps, (\d+) pending and (\d+) failing$/, function (passing, pending, failing) { });
    scenario.Given(/^Karma is configured to test these features$/, function () { });
    scenario.Given(/^one passing scenario has "([^"]+)" tag$/, function (tag) { });
    scenario.Given(/^one pending scenario has "([^"]+)" tag$/, function (tag) { });
    scenario.Given(/^Karma is configured to test scenarios of "([^"]+)" tag$/, function (tag) {
        var world = this;
        world.tags.push(tag);
    });
    scenario.When(/^I run Karma$/, function (callback) {
        var world = this;
        process.env.KARMA_CLIENT_ARGS = "--tags " + world.tags.join(' ');
        child_process_1.exec('karma start', { env: process.env }, function (error, stdout, stderr) {
            console.log(stdout);
            world.karmaOutput = stdout;
            callback();
        });
    });
    scenario.Then(/^Karma reports the following steps counts:$/, function (table) {
        var world = this;
        if (table.hashes()[0].Failed === '0') {
            var res = /.*Executed (\d+) of 1 \(skipped (\d+)\) SUCCESS \(\d+(?:.\d+)? secs \/ \d+(?:.\d+)? sec(?:s)?\)\s*$/g.exec(world.karmaOutput);
            should.exist(res);
            should.exist(res[1]);
            res[1].should.equal(table.hashes()[0].Passed);
            should.exist(res[2]);
            res[2].should.equal(table.hashes()[0].Skipped);
        }
        else {
            var res = /.*Executed (\d+) of 1 \((\d+) FAILED\) \(skipped (\d+)\) \(\d+(?:.\d+)? secs \/ \d+(?:.\d+)? sec(?:s)?\)\s*$/g.exec(world.karmaOutput);
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
};
//# sourceMappingURL=adapter-steps.js.map