const accountsService = require('../services/accounts.service');

async function open(req, res) {
  const account = await accountsService.openAccount(req.body);
  res.status(201).json({ success: true, data: account });
}

async function findByCustomer(req, res) {
  const accounts = await accountsService.findByCustomer(req.params.customerId);
  res.json({ success: true, data: accounts });
}

async function findOne(req, res) {
  const account = await accountsService.findByAccountNumber(req.params.accountNumber);
  res.json({ success: true, data: account });
}

async function syncBalance(req, res) {
  const account = await accountsService.syncBalance(req.params.accountNumber);
  res.json({ success: true, data: account });
}

module.exports = { open, findByCustomer, findOne, syncBalance };
