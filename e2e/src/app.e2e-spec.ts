import {browser, by, element, logging} from 'protractor';

describe('workspace-project App', () => {
  const email = element(by.id('email'));
  const password = element(by.id('password'));
  const button = element(by.buttonText('Submit'));
  const centerPanel = element(by.id('center-panel'));

  beforeEach(() => {
    browser.get('http://localhost:4200/login');
  });

  afterEach(async () => {
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    }));
  });

  it('should display title', () => {
    expect(browser.getTitle()).toEqual('VA3AUI');
  });

  it('should require email and password', () => {
    email.sendKeys(' ');
    centerPanel.click();

    expect(element(by.id('emailReq')).getText()).toEqual('Email is required');
    expect(element(by.id('pwdReq')).getText()).toEqual('Password is required');
  });

  it('should validate email', () => {
    email.sendKeys('abc');
    centerPanel.click();

    expect(element(by.id('emailInv')).getText()).toEqual('Email is invalid');
    expect(element(by.id('pwdReq')).getText()).toEqual('Password is required');
  });

  it('should not authenticate', () => {
    email.sendKeys('a@a');
    password.sendKeys('123');
    button.click();

    expect(element(by.id('authErr')).getText()).toEqual('Incorrect email or password');
  });
});
