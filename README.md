# Testing

## Install

```shell
npm install -g protractor
yarn install
webdriver-manager update
webdriver-manager update --versions.standalone 3.6.0
```

The above will install proctractor globally on your machine, install the local dependencies needed for the project and setup webdriver so that it works correctly with Chrome and Firefox.

# Running the tests

```shell
webdriver-manager start
protractor conf.js
```

You'll need to make sure you start webdriver-manager so that WebDriver server is listening and able to control your browsers. The launch protractor using the `conf.js` file.

The results of the tests will be output in `target/screenshots` in a subfolder with the timestamp the test was run.

