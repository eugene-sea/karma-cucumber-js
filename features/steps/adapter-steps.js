/// <reference path="../../typings/cucumber/cucumber.d.ts" />
/// <reference path="../../typings/should/should.d.ts" />
'use strict';
var child_process_1 = require('child_process');
var should = require('should');
require('source-map-support').install();
var World = (function () {
    function World(callback) {
        this.karmaOutput = '';
        this.tags = [];
        callback();
    }
    return World;
})();
module.exports = function () {
    var scenario = this;
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
        child_process_1.exec("env KARMA_CLIENT_ARGS=\"--tags " + world.tags.join(' ') + "\" ./node_modules/.bin/karma start", function (error, stdout, stderr) {
            console.log(stdout);
            world.karmaOutput = stdout.toString();
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
    });
};
//# sourceMappingURL=adapter-steps.js.map