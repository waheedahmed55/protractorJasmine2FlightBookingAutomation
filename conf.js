var HtmlScreenshotReporter = require('protractor-jasmine2-screenshot-reporter');
const moment = require('moment');

var reporter = new HtmlScreenshotReporter({
  dest: 'target/screenshots/' + moment().format('YYYY-MM-DD_hhmmss'),
  filename: 'index.html'
});

exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['test.js'],

    multiCapabilities: [{
        browserName: 'chrome'
 //  }, {
 //       browserName: 'firefox'
    }],
    jasmineNodeOpts: {defaultTimeoutInterval: 60*1000},
    allScriptsTimeout: 60 * 1000,

  // Setup the report before any tests start
  beforeLaunch: function() {
    return new Promise(function(resolve){
      reporter.beforeLaunch(resolve);
    });
  },

  // Assign the test reporter to each running instance
  onPrepare: function() {
    jasmine.getEnv().addReporter(reporter);
  },

  // Close the report after all tests finish
  afterLaunch: function(exitCode) {
    return new Promise(function(resolve){
      reporter.afterLaunch(resolve.bind(this, exitCode));
    });
  }
}