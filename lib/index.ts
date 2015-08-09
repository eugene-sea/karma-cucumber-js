/// <reference path="../typings/node/node.d.ts" />

'use strict';

import { dirname } from 'path';

function createPattern(path: string, included = true) {
    return { pattern: path, included: included, served: true, watched: false }
}

class Adapter {
    static $inject = ['config.files'];

    constructor(files: any[]) {
        let jQueryPath = dirname(require.resolve('jquery'));
        files.unshift(createPattern(`${jQueryPath}/jquery.min.map`, false));
        files.unshift(createPattern(`${jQueryPath}/jquery.min.js`));

        files.unshift(createPattern(`${__dirname}/../src/adapter.js.map`, false));
        files.unshift(createPattern(`${__dirname}/../src/adapter.js`));

        let cucumberPath = dirname(require.resolve('cucumber'));
        files.unshift(createPattern(`${cucumberPath}/../release/cucumber.js.map`, false));
        files.unshift(createPattern(`${cucumberPath}/../release/cucumber.js`));

        files.unshift(createPattern(`${__dirname}/../src/cucumber-report.css`));
    }
}

export = { 'framework:cucumber-js': ['factory', Adapter] };
