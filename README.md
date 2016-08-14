# karma-cucumber-js

This is the #1 Cucumber.js adapter for Karma. In contrast to other adapters it supports latest version of Cucumber.js (1.2.1).
This adapter does not include Cucumber.js. Cucumber.js and jQuery (required by Cucumber.js) are peer dependencies.

## Getting Started

``` Shell
npm install jquery --save-dev
npm install cucumber --save-dev
npm install karma-cucumber-js --save-dev
```

### Configuring karma.conf.js

``` JavaScript
...
frameworks: ['cucumber-js'],
...
plugins: [
  ...
  'karma-cucumber-js' // If you have plugins section then also specify this, you could omit it otherwise
  ...
],
...
files: [
  // Feature files to test
  { pattern: 'features/*.feature', included: false },
  ... // Include JS files with step definitions and any other files they require
],
...
client: { // Specify this if you want to test features/scenarios with certain tags only
  args: ['--tags', '@frontend']
},
...
reporters: ['bdd-json'], // Specify this reporter if you need to integrate test results into living documentation
bddJSONReporter: {
  outputFile: 'results.json' // 'results.json' will be filled with all scenarios test results
},
...
```

## Step Definitions

``` JavaScript
__adapter__.addStepDefinitions(function (scenario) {
    scenario.Given(/^there is a test step$/, function () { });
    scenario.When(/^it is executed$/, function () { });
    scenario.When(/^it is not executed$/, function (callback) { callback(null, 'pending'); });
    scenario.Then(/^test succeeds$/, function () { });
    scenario.Then(/^test fails$/, function (callback) { callback(new Error('Step failed')); });
});
```

## License

Copyright (c) 2015 Eugene Shalyuk.
This project is licensed under the terms of the MIT license.
