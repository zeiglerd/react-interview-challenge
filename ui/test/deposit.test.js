const root = require('./shared').root;
const signin = require('./shared').signin;
const getBalance = require('./shared').getBalance;

const deposit = async (browser, n, expected) => {
  await element('#deposit-amount').sendKeys(n);
  await element('#deposit-btn').click();
  await browser.pause(1250);
  await expect(await getBalance()).equals(expected);
}
const getDepositErrors = async () => await element('.deposit-errors li').getText();

let n;

describe('deposit', () => {
  it('deposit $400', async (browser) => {
    n = 400;
    await browser.navigateTo(root);
    await signin(8);
    await deposit(browser, n, await getBalance() + n);
  });

  it('deposit $1001', async (browser) => {
    n = 1001;
    await browser.navigateTo(root);
    await signin(8);
    await deposit(browser, n, await getBalance());
    await expect(await getDepositErrors())
      .includes('Cannot deposit more than $1000 in a single transaction.');
  });

  it('deposit $605', async (browser) => {
    n = 605;
    await browser.navigateTo(root);
    await signin(12);
    await deposit(browser, n, await getBalance());
    await expect(await getDepositErrors())
      .includes('Cannot deposit more in your account than is needed to reach a zero balance.');
  });
});
