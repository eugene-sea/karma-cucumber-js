/// <reference path="../typings/node/node.d.ts" />
'use strict';
var path_1 = require('path');
function createPattern(path, included) {
    if (included === void 0) { included = true; }
    return { pattern: path, included: included, served: true, watched: false };
}
var Adapter = (function () {
    function Adapter(files) {
        var jqueryPath = path_1.dirname(require.resolve('jquery'));
        files.unshift(createPattern(jqueryPath + "/jquery.min.map", false));
        files.unshift(createPattern(jqueryPath + "/jquery.min.js"));
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
module.exports = { 'framework:cucumber-js': ['factory', Adapter] };
//# sourceMappingURL=index.js.map