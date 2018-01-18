var HtmlScreenshotReporter = require('protractor-jasmine2-screenshot-reporter');
const moment = require('moment');
const outputDir = 'target/screenshots/' + moment().format('YYYY-MM-DD_hhmmss');
var reporter = new HtmlScreenshotReporter({
  dest: outputDir,
  filename: 'index.html'
});

exports.config = {
  rootElement: '*[ng-app]',
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['testV2.js'],

  multiCapabilities: [{
    browserName: 'chrome'
  }, {
    browserName: 'firefox'
  }],
  jasmineNodeOpts: {
    defaultTimeoutInterval: 100 * 1000
  },
  allScriptsTimeout: 100 * 1000,
  params: {
    outputDir: outputDir
  },

  // Setup the report before any tests start
  beforeLaunch: function () {
    return new Promise(function (resolve) {
      reporter.beforeLaunch(resolve);
    });
  },

  // Assign the test reporter to each running instance
  onPrepare: function () {
    jasmine.getEnv().addReporter(reporter);
  },

  // Close the report after all tests finish
  afterLaunch: function (exitCode) {
    return new Promise(function (resolve) {
      reporter.afterLaunch(resolve.bind(this, exitCode));
    });
  }
}