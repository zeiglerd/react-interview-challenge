module.exports['@disabled'] = true,

module.exports.root = 'http://localhost:3001/';

module.exports.signin = async (id) => {
  await element('#account-number').sendKeys(id);
  await element('#sign-in-btn').click();
};

module.exports.getBalance = async () => Number((await element('h2').getText()).replace(/[^-0-9]/g, ''));
