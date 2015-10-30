/// <reference path="../typings/node/node.d.ts" />
/// <reference path="../typings/karma/karma.d.ts" />

import * as path from 'path';
import * as fs from 'fs';

export class BDDJSONReporter implements karma.IKarmaReporter {
    static passed = 'passed';
    static failed = 'failed';
    static pending = 'pending';

    report: { [feature: string]: { [scenario: string]: string; }; } = {};

    static $inject = ['baseReporterDecorator', 'logger', 'helper', 'config'];

    constructor(
        baseReporterDecorator: any,
        logger: any,
        helper: any,
        config: { basePath: string; bddJSONReporter: { outputFile: string; }; }) {
        const karmaLog: Console = logger.create('bdd-json');
        baseReporterDecorator(this);

        this.onSpecComplete = (browser: any, result: karma.IKarmaResult) => {
            if (result.suite.length != 2) {
                karmaLog.warn(`Unexpected suite: ${result.suite}`);
                return;
            }

            if (!this.report[result.suite[0]]) {
                this.report[result.suite[0]] = {};
            }

            const stepStatus = BDDJSONReporter.getStepStatus(result);
            this.report[result.suite[0]][result.suite[1]] = BDDJSONReporter.mergeStatus(
                this.report[result.suite[0]][result.suite[1]], stepStatus);
        }

        this.onRunComplete = () => {
            const reporterConfig = config.bddJSONReporter || { outputFile: null };
            const outputFile = !reporterConfig.outputFile
                ? null : helper.normalizeWinPath(path.resolve(config.basePath, reporterConfig.outputFile));

            if (outputFile) {
                const report = this.report;
                helper.mkdirIfNotExists(path.dirname(outputFile), () => {
                    fs.writeFile(outputFile, JSON.stringify(report, null, 4), err => {
                        if (err) {
                            karmaLog.warn(`Cannot write JSON:\n\t${err.message}`);
                        }
                    });
                });
            }

            this.report = {};
        }
    }

    onSpecComplete: (browser: any, result: karma.IKarmaResult) => void;
    onRunComplete: () => void;

    private static getStepStatus(result: karma.IKarmaResult): string {
        if (result.success) {
            return !result.skipped ? BDDJSONReporter.passed : BDDJSONReporter.pending;
        }

        return !result.skipped ? BDDJSONReporter.failed : BDDJSONReporter.pending;
    }

    private static mergeStatus(currStatus: string, newStatus: string): string {
        if (currStatus === BDDJSONReporter.failed) {
            return BDDJSONReporter.failed;
        }

        if (currStatus === BDDJSONReporter.pending) {
            return BDDJSONReporter.pending;
        }

        return newStatus;
    }
}
