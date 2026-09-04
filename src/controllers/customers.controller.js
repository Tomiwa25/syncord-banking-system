const customersService = require('../services/customers.service');

exports.createCustomer = async (req, res, next) => {
  try {
    const customer = await customersService.createCustomer(req.body, req.user.userId);
    res.status(201).json({ message: 'Customer created successfully', data: customer });
  } catch (error) {
    next(error);
  }
};

exports.getCustomerById = async (req, res, next) => {
  try {
  const customer = await customersService.getCustomerById(req.params.id, req.user.userId);
  res.status(200).json({message: "Data Retrieved", data: customer})
  } catch (error) {
    next(error)
  }
};

exports.getCustomers = async (req, res, next) => {
  try {
  const customers = await customersService.getCustomers();
  res.status(200).json({ message: " Customer Data Retrieved", data: customers })
  } catch (error) {
    next(error)
  }
};

exports.updateCustomerById = async (req, res, next) => {
  try {
  const customer = await customersService.updateCustomer(req.params.id, req.body, req.user.userId);
  res.status(200).json({ message: "Customer updated successfully", data: customer})
  } catch (error) {
    next(error)
  }
};

exports.updateCustomer = exports.updateCustomerById;
