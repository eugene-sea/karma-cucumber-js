/// <reference path="../../typings/cucumber/cucumber.d.ts" />
/// <reference path="../../typings/should/should.d.ts" />
'use strict';
var child_process_1 = require('child_process');
var should = require('should');
require('source-map-support').install();
var World = (function () {
    function World(callback) {
        this.karmaOutput = '';
        callback();
    }
    return World;
})();
module.exports = function () {
    var _this = this;
    var scenario = this;
    scenario.World = World;
    scenario.Given(/^I have several features with (\d+) passing steps, (\d+) pending and (\d+) failing$/, function (passing, pending, failing) { });
    scenario.Given(/^Karma is configured to test these features$/, function () { });
    scenario.Given(/^one passing scenario has "([^"]*)" tag$/, function (tag, callback) {
        callback.pending();
    });
    scenario.Given(/^one pending scenario has "([^"]*)" tag$/, function (tag, callback) {
        callback.pending();
    });
    scenario.Given(/^Karma is configured to test scenarios of "([^"]*)" tag only$/, function (tag, callback) {
        callback.pending();
    });
    scenario.When(/^I run Karma$/, function (callback) {
        child_process_1.exec('./node_modules/.bin/karma start', function (error, stdout, stderr) {
            var world = _this;
            // console.log(stdout);
            world.karmaOutput = stdout.toString();
            callback();
        });
    });
    scenario.Then(/^Karma reports the following steps counts:$/, function (table) {
        var world = _this;
        var res = /.*Executed (\d+) of 1 \((\d+) FAILED\) \(skipped (\d+)\) \(\d+(?:.\d+)? secs \/ \d+(?:.\d+)? sec(?:s)?\)\s*$/g.exec(world.karmaOutput);
        should.exist(res);
        should.exists(res[1]);
        Number(res[1]).should.equal(Number(table.hashes()[0].Passed) + Number(table.hashes()[0].Failed));
        should.exists(res[2]);
        res[2].should.equal(table.hashes()[0].Failed);
        should.exists(res[3]);
        res[3].should.equal(table.hashes()[0].Skipped);
    });
};
//# sourceMappingURL=adapter-steps.js.map