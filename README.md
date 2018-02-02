<a name="README">[<img src="https://rawgithub.com/jasmine/jasmine/master/images/jasmine-horizontal.svg" width="400px" />](http://jasmine.github.io)</a>
# Testing

## Install

```shell
npm install -g protractor
yarn install
webdriver-manager update
webdriver-manager update --versions.standalone 3.6.0
```

The above will install proctractor globally on your machine, install the local dependencies needed for the project and setup webdriver so that it works correctly with Chrome and Firefox.
If the yarn doesnt work from command add it to Path in envirnoment variable. 

# Running the tests

```shell
webdriver-manager start
protractor conf.js
```

You'll need to make sure you start webdriver-manager so that WebDriver server is listening and able to control your browsers. The launch protractor using the `conf.js` file.


# Test Reports

```shell
http://htmlpreview.github.io/?https://github.com/waheedahmed55/protractorJasmine2FlightBookingAutomation/blob/master/target2/ConsolidatedReport.html
```

The results of the tests will be output in `target/screenshots` & `target2/` these folders for now I have added two types of html reports one using htmlscreenshot and other using regular htmlreport. The test result files under `target2/` folder are better and improved version. I did this for the scenario when running multiple instances for example running test cases parallel in two different browsers it generates the individual test report for browser with their browser name, browser version and platform and at same it creates `ConsolidatedReport.html` . In order to view the `ConsolidatedReport.html` type the above command in brwoser just to note they dont support images basically they are screenshots.