/// <reference path="../typings/node/node.d.ts" />
/// <reference path="../typings/karma/karma.d.ts" />
'use strict';
var path_1 = require('path');
var bdd_json_reporter_1 = require('./bdd-json-reporter');
function createPattern(path, included) {
    if (included === void 0) { included = true; }
    return { pattern: path, included: included, served: true, watched: false };
}
var Adapter = (function () {
    function Adapter(files) {
        var jQueryPath = path_1.dirname(require.resolve('jquery'));
        files.unshift(createPattern(jQueryPath + "/jquery.min.map", false));
        files.unshift(createPattern(jQueryPath + "/jquery.min.js"));
        files.unshift(createPattern(__dirname + "/../src/adapter.js.map", false));
        files.unshift(createPattern(__dirname + "/../src/adapter.js"));
        var cucumberPath = path_1.dirname(require.resolve('cucumber'));
        files.unshift(createPattern(cucumberPath + "/../release/cucumber.js.map", false));
        files.unshift(createPattern(cucumberPath + "/../release/cucumber.js"));
        files.unshift(createPattern(__dirname + "/../src/cucumber-report.css"));
    }
    Adapter.$inject = ['config.files'];
    return Adapter;
})();
module.exports = { 'framework:cucumber-js': ['type', Adapter], 'reporter:bdd-json': ['type', bdd_json_reporter_1.BDDJSONReporter] };
//# sourceMappingURL=index.js.map