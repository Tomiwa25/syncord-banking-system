const transactionsService = require('../services/transactions.service');

async function nameEnquiry(req, res) {
  const result = await transactionsService.nameEnquiry(req.body);
  res.json({ success: true, data: result });
}

async function transfer(req, res) {
  const transaction = await transactionsService.transfer(req.body);
  res.status(201).json({ success: true, data: transaction });
}

async function reconcile(req, res) {
  const transaction = await transactionsService.reconcile(req.params.reference);
  res.json({ success: true, data: transaction });
}

async function findByAccount(req, res) {
  const transactions = await transactionsService.findByAccount(req.params.accountNumber);
  res.json({ success: true, data: transactions });
}

async function findOne(req, res) {
  const transaction = await transactionsService.findByReference(req.params.reference);
  res.json({ success: true, data: transaction });
}

module.exports = { nameEnquiry, transfer, reconcile, findByAccount, findOne };
