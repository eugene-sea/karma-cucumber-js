/// <reference path="../typings/cucumber/cucumber.d.ts" />
'use strict';
var cucumber;
(function (cucumber) {
    var CucumberHTMLListener = (function () {
        function CucumberHTMLListener(rootElement) {
            this.formatter = new CucumberHTML.DOMFormatter(rootElement);
        }
        CucumberHTMLListener.prototype.hear = function (event, callback) {
            var eventName = event.getName();
            switch (eventName) {
                case 'BeforeFeature':
                    var feature = event.getPayloadItem('feature');
                    this.formatter.uri(feature.getUri());
                    this.formatter.feature(CucumberHTMLListener.getDOMFormatterElement(feature));
                    break;
                case 'BeforeScenario':
                    var scenario = event.getPayloadItem('scenario');
                    this.formatter.scenario(CucumberHTMLListener.getDOMFormatterElement(scenario));
                    break;
                case 'BeforeStep':
                    var step = event.getPayloadItem('step');
                    this.formatter.step(CucumberHTMLListener.getDOMFormatterElement(step));
                    break;
                case 'StepResult':
                    var stepResult = event.getPayloadItem('stepResult');
                    step = stepResult.getStep();
                    var result;
                    if (stepResult.isSuccessful()) {
                        result = { status: 'passed' };
                    }
                    else if (stepResult.isPending()) {
                        result = { status: 'pending' };
                    }
                    else if (stepResult.isUndefined() || stepResult.isSkipped()) {
                        result = { status: 'skipped' };
                    }
                    else {
                        var error = stepResult.getFailureException();
                        var errorMessage = typeof error === 'string' ? error : error.stack;
                        result = { status: 'failed', error_message: errorMessage };
                    }
                    this.formatter.match({ uri: step.getUri(), step: { line: step.getLine() } });
                    this.formatter.result(result);
                    break;
            }
            callback();
        };
        CucumberHTMLListener.getDOMFormatterElement = function (element) {
            return {
                keyword: element.getKeyword(),
                name: element.getName(),
                line: element.getLine(),
                description: !element.getDescription ? undefined : element.getDescription()
            };
        };
        return CucumberHTMLListener;
    })();
    cucumber.CucumberHTMLListener = CucumberHTMLListener;
})(cucumber || (cucumber = {}));
/// <reference path="../typings/karma/karma.d.ts" />
/// <reference path="../typings/cucumber/cucumber.d.ts" />
'use strict';
var cucumber;
(function (cucumber) {
    var CucumberKarmaListener = (function () {
        function CucumberKarmaListener(karma) {
            this.karma = karma;
            this.totalSteps = 0;
        }
        CucumberKarmaListener.prototype.hear = function (event, callback) {
            var eventName = event.getName();
            switch (eventName) {
                case 'BeforeFeature':
                    this.feature = event.getPayloadItem('feature');
                    break;
                case 'BeforeScenario':
                    this.scenario = event.getPayloadItem('scenario');
                    break;
                case 'StepResult':
                    ++this.totalSteps;
                    this.karma.info({ total: this.totalSteps });
                    var stepResult = event.getPayloadItem('stepResult');
                    var step = stepResult.getStep();
                    var stepId = step.getName() + " : " + step.getLine();
                    var result = {
                        id: stepId,
                        description: '',
                        log: [],
                        suite: [this.feature.getName(), this.scenario.getName()],
                        success: false,
                        skipped: false,
                        time: (stepResult.getDuration() || 0) / 1000
                    };
                    if (stepResult.isSuccessful()) {
                        result.success = true;
                    }
                    else if (stepResult.isPending()) {
                        result.skipped = true;
                    }
                    else if (stepResult.isUndefined() || stepResult.isSkipped()) {
                        result.success = true;
                        result.skipped = true;
                    }
                    else {
                        var error = stepResult.getFailureException();
                        var errorMessage = typeof error === 'string' ? error : error.stack;
                        result.log.push("Step: " + stepId + "\n" + errorMessage);
                    }
                    this.karma.result(result);
                    break;
            }
            callback();
        };
        return CucumberKarmaListener;
    })();
    cucumber.CucumberKarmaListener = CucumberKarmaListener;
})(cucumber || (cucumber = {}));
/// <reference path="../typings/karma/karma.d.ts" />
/// <reference path="../typings/cucumber/cucumber.d.ts" />
/// <reference path="./cucumber-html-listener.ts" />
/// <reference path="./cucumber-karma-listener.ts" />
'use strict';
var karma;
(function (karma_1) {
    var CucumberAdapter = (function () {
        function CucumberAdapter(karma) {
            this.karma = karma;
            this.stepDefinitionsCallbacks = [];
        }
        CucumberAdapter.prototype.getStart = function () {
            var _this = this;
            return function () {
                var featuresUrls = Object.keys(_this.karma.files).filter(function (f) { return /\.feature$/.test(f); });
                console.log("Found features: " + featuresUrls.join(', '));
                var features = CucumberAdapter.loadFeatures(featuresUrls);
                var cucumberReporterNode = CucumberAdapter.createCucumberReporterNode();
                _this.runFeatures(features, cucumberReporterNode);
            };
        };
        CucumberAdapter.prototype.addStepDefinitions = function (callback) {
            this.stepDefinitionsCallbacks.push(callback);
        };
        CucumberAdapter.loadFeatures = function (featuresUrls) {
            var res = [];
            return featuresUrls.map(function (f) { return [f, CucumberAdapter.loadFile(f)]; });
        };
        CucumberAdapter.loadFile = function (url) {
            var client = new XMLHttpRequest();
            client.open("GET", url, false);
            client.send();
            return client.responseText;
        };
        CucumberAdapter.createCucumberReporterNode = function () {
            var cucumberReporterNode = document.createElement('div');
            cucumberReporterNode.className = 'cucumber-report';
            document.body.appendChild(cucumberReporterNode);
            return cucumberReporterNode;
        };
        CucumberAdapter.prototype.runFeatures = function (features, rootElement) {
            var _this = this;
            var self = this;
            var cucumberInstance = new Cucumber(features, function () {
                var scenario = this; // Supplied by Cucumber
                self.stepDefinitionsCallbacks.forEach(function (c) { return c(scenario); });
            });
            cucumberInstance.attachListener(new cucumber.CucumberHTMLListener(rootElement));
            cucumberInstance.attachListener(new cucumber.CucumberKarmaListener(this.karma));
            // cucumberInstance.start(() => { });
            cucumberInstance.start(function () { return _this.karma.complete({ coverage: window.__coverage__ }); });
        };
        return CucumberAdapter;
    })();
    karma_1.CucumberAdapter = CucumberAdapter;
})(karma || (karma = {}));
var __adapter__;
(function () {
    var adapter = new karma.CucumberAdapter(__karma__);
    __adapter__ = adapter;
    __karma__.start = adapter.getStart();
})();
//# sourceMappingURL=adapter.js.map