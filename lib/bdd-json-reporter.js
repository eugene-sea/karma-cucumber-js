/// <reference path="../typings/node/node.d.ts" />
/// <reference path="../typings/karma/karma.d.ts" />
"use strict";
var path = require('path');
var fs = require('fs');
var BDDJSONReporter = (function () {
    function BDDJSONReporter(baseReporterDecorator, logger, helper, config) {
        var _this = this;
        this.report = {};
        var karmaLog = logger.create('bdd-json');
        baseReporterDecorator(this);
        this.onSpecComplete = function (browser, result) {
            if (result.suite.length != 2) {
                karmaLog.warn("Unexpected suite: " + result.suite);
                return;
            }
            if (!_this.report[result.suite[0]]) {
                _this.report[result.suite[0]] = { featureStatus: null };
            }
            var stepStatus = BDDJSONReporter.getStepStatus(result);
            _this.report[result.suite[0]][result.suite[1]] = BDDJSONReporter.mergeStatus(_this.report[result.suite[0]][result.suite[1]], stepStatus);
            _this.report[result.suite[0]].featureStatus = BDDJSONReporter.mergeStatus(_this.report[result.suite[0]].featureStatus, _this.report[result.suite[0]][result.suite[1]]);
        };
        this.onRunComplete = function () {
            var reporterConfig = config.bddJSONReporter || { outputFile: null };
            var outputFile = !reporterConfig.outputFile
                ? null : helper.normalizeWinPath(path.resolve(config.basePath, reporterConfig.outputFile));
            if (outputFile) {
                var report_1 = _this.report;
                helper.mkdirIfNotExists(path.dirname(outputFile), function () {
                    fs.writeFile(outputFile, JSON.stringify(report_1, null, 4), function (err) {
                        if (err) {
                            karmaLog.warn("Cannot write JSON:\n\t" + err.message);
                        }
                    });
                });
            }
            _this.report = {};
        };
    }
    BDDJSONReporter.getStepStatus = function (result) {
        if (result.success) {
            return !result.skipped ? BDDJSONReporter.passed : BDDJSONReporter.pending;
        }
        return !result.skipped ? BDDJSONReporter.failed : BDDJSONReporter.pending;
    };
    BDDJSONReporter.mergeStatus = function (currStatus, newStatus) {
        if (currStatus === BDDJSONReporter.failed) {
            return BDDJSONReporter.failed;
        }
        if (currStatus === BDDJSONReporter.pending) {
            return BDDJSONReporter.pending;
        }
        return newStatus;
    };
    BDDJSONReporter.passed = 'passed';
    BDDJSONReporter.failed = 'failed';
    BDDJSONReporter.pending = 'pending';
    BDDJSONReporter.$inject = ['baseReporterDecorator', 'logger', 'helper', 'config'];
    return BDDJSONReporter;
}());
exports.BDDJSONReporter = BDDJSONReporter;
//# sourceMappingURL=bdd-json-reporter.js.map