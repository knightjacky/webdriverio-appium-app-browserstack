exports.config = {
    user: process.env.BROWSERSTACK_USERNAME || 'BROWSERSTACK_USERNAME',
    key: process.env.BROWSERSTACK_ACCESS_KEY || 'BROWSERSTACK_ACC_KEY',

  updateJob: false,
  specs: [
    './tests/specs/single_test.js'
  ],
  exclude: [],

  capabilities: [{
    name: 'single_appium_test',
    build: 'webdriver-browserstack',
    device: 'Samsung Galaxy S7',
    browserName: 'android',
    app: process.env.BROWSERSTACK_APP_ID || 'bs://<hashed app-id>',
    'browserstack.debug': true
  }],

  logLevel: 'verbose',
  coloredLogs: true,
  screenshotPath: './errorShots/',
  baseUrl: '',
  waitforTimeout: 10000,
  connectionRetryTimeout: 90000,
  connectionRetryCount: 3,

  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd',
    timeout: 2000000
  },
  before: function () {
    const {Eyes, Target} = require('@applitools/eyes.webdriverio');
    const eyes = new Eyes();
    eyes.setApiKey('applitools-accesskey');

    browser.addCommand("EyesOpen", async function (testName) {
        console.log("Opening eyes");
        const widthSize = browser.getViewportSize('width');
        console.log(widthSize);

        const heightSize = browser.getViewportSize('height');
        console.log(heightSize);
        eyes.setForceFullPageScreenshot(true);
        // eyes.setStitchMode(Eyes.StitchMode.CSS);
        // eyes.setHideScrollbars(true);
        // await eyes.open(browser, 'Smart Pix Online', testName, {width: widthSize, height: heightSize});
        await eyes.open(browser, 'Demo applitools', testName);
    });

    browser.addCommand("EyesCheckWindow", async function async(tag) {
        console.log("Validating eyes");
        return await eyes.check(tag, Target.window());
    });

    browser.addCommand("EyesClose", async function async(throwEx) {
        console.log("Closing eyes");
        return await eyes.close(throwEx).then(function (res) {
            // console.log(">> Test Result <<");
            // console.log(res);
            // console.log(res.appUrls.session);
            return res;
        });
        eyes.abortIfNotClosed();
    });
},
};
