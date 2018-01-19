var HtmlScreenshotReporter = require('protractor-jasmine2-screenshot-reporter');
var Jasmine2HtmlReporter = require('protractor-jasmine2-html-reporter');
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
	  return new Promise(function (fulfill, reject) {
            browser.getCapabilities().then(function (value) {

                //chrome
                let browserVersion = value.get('version');
                if (!browserVersion){
                    //firefox
                    browserVersion = value.get('browserVersion');
                }
                let platform = value.get('platform');
                if (!platform){
                    platform = value.get('platformName');
                }

				reportName = platform + '_' + value.get('browserName') + '_'+ browserVersion + '_'+ Math.floor(Math.random()*1E16);
                jasmine.getEnv().addReporter(
                    new Jasmine2HtmlReporter({
                        savePath: 'target2/',
                        screenshotsFolder: 'images',
                        consolidate: false,
                        consolidateAll: false,
                        fileName: reportName + ".html"
                    })
                );
				jasmine.getEnv().addReporter(reporter);
                fulfill();

            })
        });
  },

  // Close the report after all tests finish
  afterLaunch: function (exitCode) {
    return new Promise(function (resolve) {
      var fs = require('fs');
      var output = '';
      fs.readdirSync('target2/').forEach(function(file) {
        var matches = file.match(/_(\S+)_/);
       if(fs.lstatSync('target2/' + file).isDirectory() || matches == null) {
          return;
      }
		    var browserName = matches[1];
        output = output + "<h1>" + browserName + "</h1>" + fs.readFileSync('target2/' + file);
      });
      fs.writeFileSync('target2/ConsolidatedReport.html', output, 'utf8');
		  reporter.afterLaunch(resolve.bind(this, exitCode));
    });

  }
}