/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../typings/should/should.d.ts" />
/// <reference path="../typings/karma/karma.d.ts" />
require('source-map-support').install();
var should = require('should');
var bdd_json_reporter_1 = require('../lib/bdd-json-reporter');
function createKarmaResult(feature, scenario, success, skipped) {
    return {
        id: 'id',
        description: 'test step',
        log: [],
        suite: [feature, scenario],
        success: success,
        skipped: skipped,
        time: 0
    };
}
describe('BDDJSONReporter', function () {
    var reporter;
    beforeEach(function () { return reporter = new bdd_json_reporter_1.BDDJSONReporter(function () { }, { create: function () { } }, null, null); });
    describe('Calculating scenarios status logic', function () {
        it('If all steps are succeeded then scenario should be reported as succeeded', function () {
            reporter.onSpecComplete(null, createKarmaResult('test feature', 'test scenario', true, false));
            reporter.onSpecComplete(null, createKarmaResult('test feature', 'test scenario', true, false));
            should.exist(reporter.report['test feature']);
            reporter.report['test feature']['test scenario'].should.be.equal(bdd_json_reporter_1.BDDJSONReporter.passed);
        });
        it('If some steps are succeeded and some are pending then scenario should be reported as pending', function () {
            reporter.onSpecComplete(null, createKarmaResult('test feature', 'test scenario', true, true));
            reporter.onSpecComplete(null, createKarmaResult('test feature', 'test scenario', true, false));
            should.exist(reporter.report['test feature']);
            reporter.report['test feature']['test scenario'].should.be.equal(bdd_json_reporter_1.BDDJSONReporter.pending);
        });
        it('If some steps are failed then scenario should be reported as failed', function () {
            reporter.onSpecComplete(null, createKarmaResult('test feature', 'test scenario', false, false));
            reporter.onSpecComplete(null, createKarmaResult('test feature', 'test scenario', false, true));
            reporter.onSpecComplete(null, createKarmaResult('test feature', 'test scenario', true, false));
            should.exist(reporter.report['test feature']);
            reporter.report['test feature']['test scenario'].should.be.equal(bdd_json_reporter_1.BDDJSONReporter.failed);
        });
    });
    describe('Calculating features status logic', function () {
        it('If all scenarios are succeeded then feature should be reported as succeeded', function () {
            reporter.onSpecComplete(null, createKarmaResult('test feature', 'test scenario 1', true, false));
            reporter.onSpecComplete(null, createKarmaResult('test feature', 'test scenario 2', true, false));
            should.exist(reporter.report['test feature']);
            reporter.report['test feature'].featureStatus.should.be.equal(bdd_json_reporter_1.BDDJSONReporter.passed);
        });
        it('If some scenarios are succeeded and some are pending then feature should be reported as pending', function () {
            reporter.onSpecComplete(null, createKarmaResult('test feature', 'test scenario 1', true, true));
            reporter.onSpecComplete(null, createKarmaResult('test feature', 'test scenario 2', true, false));
            should.exist(reporter.report['test feature']);
            reporter.report['test feature'].featureStatus.should.be.equal(bdd_json_reporter_1.BDDJSONReporter.pending);
        });
        it('If some scenarios are failed then feature should be reported as failed', function () {
            reporter.onSpecComplete(null, createKarmaResult('test feature', 'test scenario 1', false, false));
            reporter.onSpecComplete(null, createKarmaResult('test feature', 'test scenario 2', false, true));
            reporter.onSpecComplete(null, createKarmaResult('test feature', 'test scenario 3', true, false));
            should.exist(reporter.report['test feature']);
            reporter.report['test feature'].featureStatus.should.be.equal(bdd_json_reporter_1.BDDJSONReporter.failed);
        });
    });
});
//# sourceMappingURL=bdd-json-reporter-tests.js.map