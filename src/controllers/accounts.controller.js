const accountsService = require('../services/accounts.service');

exports.createAccount = async (req, res, next) => {
  try {
    const account = await accountsService.createAccount(req.body);
    res.status(201).json({ success: true,  message: "Account created successfully", data: account });
  } catch (error) {
    next(error)
  }
};

exports.getAccountById = async (req, res, next) => {
  try {
    const account = await accountsService.getAccountById(req.params.accountNumber);
    res.status(201).json({ success: true,  message: "Account retrieved", data: account });
  } catch (error) {
    next(error)
  }
};

exports.getCustomerAccounts = async (req, res, next) => {
  try {
    const accounts = await accountsService.getCustomerAccounts(req.params.customerId);
    res.status(201).json({ success: true,  message: "Customer details retrieved", data: accounts });
  } catch (error) {
    next(error)
  }
};

exports.getBalance = async (req, res, next) => {
  try {
    const balance = await accountsService.getBalance(req.params.accountNumber);
    res.status(201).json({ success: true,  message: "Customer details retrieved", data: balance });
  } catch (error) {
    next(error)
  }
};

exports.nameEnquiry = async (req, res, next) => {
  try {
    const result = await accountsService.nameEnquiry(req.params.accountNumber);
    res.status(201).json({ success: true,  message: "Name details retrieved", data: result });
  } catch (error) {
    next(error)
  }
};


exports.getAllAccounts = async (req, res, next) => {
  try {
    const accounts = await accountsService.getAllAccounts();
    res.status(201).json({ success: true,  message: "Customer details retrieved", data: accounts });
  } catch (error) {
    next(error)
  }
};

