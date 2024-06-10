const root = require('./shared').root;
const signin = require('./shared').signin;
const getBalance = require('./shared').getBalance;

const withdraw = async (browser, n, expected) => {
  await element('#withdraw-amount').sendKeys(n);
  await element('#withdraw-btn').click();
  await browser.pause(1250);
  await expect(await getBalance()).equals(expected);
}
const getWithdrawErrors = async () => await element('.withdraw-errors li').getText();

let n;

describe('withdraw', () => {
  it(`withdraw $205`, async (browser) => {
    n = 205;
    await browser.navigateTo(root);
    await signin(8);
    await withdraw(browser, n, await getBalance());
    await expect(await getWithdrawErrors())
      .includes('Can withdraw no more than $200 in a single transaction.');
  });

  it(`withdraw $200 x3`, async (browser) => {
    n = 200;

    await browser.navigateTo(root);
    await signin(8);
    await withdraw(browser, n, await getBalance() - n);

    await browser.navigateTo(root);
    await signin(8);
    await withdraw(browser, n, await getBalance() - n);

    await browser.navigateTo(root);
    await signin(8);
    await withdraw(browser, n, await getBalance());
    await expect(await getWithdrawErrors())
      .includes('Can withdraw no more than $400 in a single day. You have withdrawn $400.');
  });

  it(`withdraw $${n}`, async (browser) => {
    n = 1;
    await browser.navigateTo(root);
    await signin(8);
    await withdraw(browser, n, await getBalance());
    await expect(await getWithdrawErrors())
      .includes('Can only withdraw an amount that can be dispensed in $5 bills.');

    n = 4;
    await browser.navigateTo(root);
    await signin(8);
    await withdraw(browser, n, await getBalance());
    await expect(await getWithdrawErrors())
      .includes('Can only withdraw an amount that can be dispensed in $5 bills.');

    n = 9;
    await browser.navigateTo(root);
    await signin(8);
    await withdraw(browser, n, await getBalance());
    await expect(await getWithdrawErrors())
      .includes('Can only withdraw an amount that can be dispensed in $5 bills.');
  });

  it(`withdraw $5`, async (browser) => {
    n = 5;
    await browser.navigateTo(root);
    await signin(6);
    await withdraw(browser, n, await getBalance());
    await expect(await getWithdrawErrors())
      .includes('Cannot withdraw more than your credit limit. Your credit limit is $60000.');
  });

  it(`withdraw $105`, async (browser) => {
    n = 105;
    await browser.navigateTo(root);
    await signin(11);
    await withdraw(browser, n, await getBalance());
    await expect(await getWithdrawErrors())
      .includes('Cannot withdraw more than you have in your account.');
  });
});
