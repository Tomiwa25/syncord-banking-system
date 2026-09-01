const customersService = require('../services/customers.service');

async function onboard(req, res) {
  const customer = await customersService.onboard(req.body);
  res.status(201).json({ success: true, data: customer });
}

async function findAll(_req, res) {
  const customers = await customersService.findAll();
  res.json({ success: true, data: customers });
}

async function findOne(req, res) {
  const customer = await customersService.findById(req.params.id);
  res.json({ success: true, data: customer });
}

async function update(req, res) {
  const customer = await customersService.update(req.params.id, req.body);
  res.json({ success: true, data: customer });
}

module.exports = { onboard, findAll, findOne, update };
