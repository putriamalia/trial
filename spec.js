var origFn = browser.driver.controlFlow().execute;

browser.driver.controlFlow().execute = function () {
  var args = arguments;

  origFn.call(browser.driver.controlFlow(), function () {
    return protractor.promise.delayed(300);
  });

  return origFn.apply(browser.driver.controlFlow(), args);
};

describe('Protractor PLN App', function () {
  browser.manage().window().setSize(1400, 900);
  it('It has to be login page', function () {
    browser.get('http://localhost:4200');
  });
  it('Submit login page', function () {
    browser.waitForAngularEnabled(true);
    element(by.id('formGroupExampleInput')).sendKeys('Bret');
    element(by.id('loginButton')).click();
    browser.waitForAngular();
  });
  it('Check Map', function () {
    browser.waitForAngularEnabled(true);
  });
});