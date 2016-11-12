/// <reference path="../typings/cucumber/cucumber.d.ts" />
'use strict';
var cucumber;
(function (cucumber) {
    var CucumberHTMLListener = (function () {
        function CucumberHTMLListener(rootElement) {
            this.formatter = new CucumberHTML.DOMFormatter(rootElement);
        }
        CucumberHTMLListener.prototype.hear = function (event, defaultTimeout, callback) {
            var eventName = event.getName();
            switch (eventName) {
                case 'BeforeFeature':
                    var feature = event.getPayload('feature');
                    this.formatter.uri(feature.getUri());
                    this.formatter.feature(CucumberHTMLListener.getDOMFormatterElement(feature));
                    break;
                case 'BeforeScenario':
                    var scenario = event.getPayload('scenario');
                    this.formatter.scenario(CucumberHTMLListener.getDOMFormatterElement(scenario));
                    break;
                case 'BeforeStep':
                    var step = event.getPayload('step');
                    this.formatter.step(CucumberHTMLListener.getDOMFormatterElement(step));
                    break;
                case 'StepResult':
                    var stepResult = event.getPayload('stepResult');
                    step = stepResult.getStep();
                    var result = void 0;
                    var status_1 = stepResult.getStatus();
                    if (status_1 !== 'failed') {
                        result = { status: status_1 };
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
    }());
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
        CucumberKarmaListener.prototype.hear = function (event, defaultTimeout, callback) {
            var eventName = event.getName();
            switch (eventName) {
                case 'BeforeFeature':
                    this.feature = event.getPayload('feature');
                    break;
                case 'BeforeScenario':
                    this.scenario = event.getPayload('scenario');
                    break;
                case 'StepResult':
                    ++this.totalSteps;
                    this.karma.info({ total: this.totalSteps });
                    var stepResult = event.getPayload('stepResult');
                    var step = stepResult.getStep();
                    var suite_1 = [this.feature.getName(), this.scenario.getName()];
                    var description = "" + step.getKeyword() + step.getName();
                    var stepId = description + " : " + step.getLine();
                    var result = {
                        id: stepId,
                        description: description,
                        log: [],
                        suite: suite_1,
                        success: false,
                        skipped: false,
                        time: (stepResult.getDuration() || 0) / 1000000
                    };
                    switch (stepResult.getStatus()) {
                        case 'passed':
                            result.success = true;
                            break;
                        case 'pending':
                            result.skipped = true;
                            console.log("Step is pending: " + suite_1.join(' -> ') + " -> " + stepId);
                            break;
                        case 'undefined':
                            console.log("Step is undefined: " + suite_1.join(' -> ') + " -> " + stepId);
                        case 'skipped':
                            result.success = true;
                            result.skipped = true;
                            break;
                        case 'ambiguous':
                            var ambiguousStepDefinitions = stepResult.getAmbiguousStepDefinitions()
                                .map(function (s) { return s.getUri() + " : " + s.getLine(); });
                            result.log.push("Step is ambiguous: " + stepId + "\n" + ambiguousStepDefinitions.join('\n'));
                            break;
                        default:
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
    }());
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
                var tags = CucumberAdapter.getTags(_this.karma.config.args);
                console.log("Tags: " + tags.join(', '));
                var features = CucumberAdapter.loadFeatures(featuresUrls);
                var cucumberReporterNode = CucumberAdapter.createCucumberReporterNode();
                _this.runFeatures(features, tags, cucumberReporterNode);
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
        CucumberAdapter.getTags = function (args) {
            var tagsIndex = args.indexOf('--tags');
            if (tagsIndex < 0) {
                return [];
            }
            var lastTagsIndex = args.indexOf('--', tagsIndex + 1);
            return args.slice(tagsIndex + 1, lastTagsIndex < 0 ? args.length : lastTagsIndex).filter(function (s) { return !!s; });
        };
        CucumberAdapter.prototype.runFeatures = function (features, tags, rootElement) {
            var _this = this;
            var self = this;
            var cucumberInstance = new Cucumber(features, function () {
                var scenario = this; // Supplied by Cucumber
                self.stepDefinitionsCallbacks.forEach(function (c) { return c(scenario); });
            }, { tags: tags });
            cucumberInstance.attachListener(new cucumber.CucumberHTMLListener(rootElement));
            cucumberInstance.attachListener(new cucumber.CucumberKarmaListener(this.karma));
            // cucumberInstance.start(() => { });
            cucumberInstance.start(function () { return _this.karma.complete({ coverage: window.__coverage__ }); });
        };
        return CucumberAdapter;
    }());
    karma_1.CucumberAdapter = CucumberAdapter;
})(karma || (karma = {}));
var __adapter__;
(function () {
    var adapter = new karma.CucumberAdapter(__karma__);
    __adapter__ = adapter;
    __karma__.start = adapter.getStart();
})();
//# sourceMappingURL=adapter.js.map