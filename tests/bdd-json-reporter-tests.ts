/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../typings/should/should.d.ts" />
/// <reference path="../typings/karma/karma.d.ts" />

require('source-map-support').install();

import * as should from 'should';

import { BDDJSONReporter } from '../lib/bdd-json-reporter';

function createKarmaResult(feature: string, scenario: string, success: boolean, skipped: boolean): karma.IKarmaResult {
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

describe('BDDJSONReporter', () => {
    let reporter: BDDJSONReporter;
    beforeEach(() => reporter = new BDDJSONReporter(() => { }, { create: () => { } }, null, null));

    describe('Calculating scenarios status logic', () => {
        it('If all steps are succeeded then scenario should be reported as succeeded', () => {
            reporter.onSpecComplete(null, createKarmaResult('test feature', 'test scenario', true, false));
            reporter.onSpecComplete(null, createKarmaResult('test feature', 'test scenario', true, false));
            should.exist(reporter.report['test feature']);
            reporter.report['test feature']['test scenario'].should.be.equal(BDDJSONReporter.passed);
        });

        it('If some steps are succeeded and some are pending then scenario should be reported as pending', () => {
            reporter.onSpecComplete(null, createKarmaResult('test feature', 'test scenario', true, true));
            reporter.onSpecComplete(null, createKarmaResult('test feature', 'test scenario', true, false));
            should.exist(reporter.report['test feature']);
            reporter.report['test feature']['test scenario'].should.be.equal(BDDJSONReporter.pending);
        });

        it('If some steps are failed then scenario should be reported as failed', () => {
            reporter.onSpecComplete(null, createKarmaResult('test feature', 'test scenario', false, false));
            reporter.onSpecComplete(null, createKarmaResult('test feature', 'test scenario', false, true));
            reporter.onSpecComplete(null, createKarmaResult('test feature', 'test scenario', true, false));
            should.exist(reporter.report['test feature']);
            reporter.report['test feature']['test scenario'].should.be.equal(BDDJSONReporter.failed);
        });
    });

    describe('Calculating features status logic', () => {
        it('If all scenarios are succeeded then feature should be reported as succeeded', () => {
            reporter.onSpecComplete(null, createKarmaResult('test feature', 'test scenario 1', true, false));
            reporter.onSpecComplete(null, createKarmaResult('test feature', 'test scenario 2', true, false));
            should.exist(reporter.report['test feature']);
            reporter.report['test feature'].featureStatus.should.be.equal(BDDJSONReporter.passed);
        });

        it('If some scenarios are succeeded and some are pending then feature should be reported as pending', () => {
            reporter.onSpecComplete(null, createKarmaResult('test feature', 'test scenario 1', true, true));
            reporter.onSpecComplete(null, createKarmaResult('test feature', 'test scenario 2', true, false));
            should.exist(reporter.report['test feature']);
            reporter.report['test feature'].featureStatus.should.be.equal(BDDJSONReporter.pending);
        });

        it('If some scenarios are failed then feature should be reported as failed', () => {
            reporter.onSpecComplete(null, createKarmaResult('test feature', 'test scenario 1', false, false));
            reporter.onSpecComplete(null, createKarmaResult('test feature', 'test scenario 2', false, true));
            reporter.onSpecComplete(null, createKarmaResult('test feature', 'test scenario 3', true, false));
            should.exist(reporter.report['test feature']);
            reporter.report['test feature'].featureStatus.should.be.equal(BDDJSONReporter.failed);
        });
    });
});
