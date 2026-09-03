const transactionsService = require('../services/transactions.service');

exports.deposit = async (req, res, next) => {
  try {
    const transaction = await transactionsService.deposit(req.body);
    res.status(201).json({
      success: true,
      message: "Deposit successful",
      data: transaction,
    })
  } catch(error) {
    next(error)
  }
};

exports.withdraw = async (req, res, next) => {
  try {
  const transaction = await transactionsService.withdraw(req.body);
    res.status(201).json({
      success: true,
      message: "Withdraw successful",
      data: transaction,
    }) 
  } catch (error) {
    next(error)
  }
};

exports.transfer = async (req, res, next) => {
  try {
  const transaction = await transactionsService.transfer(req.body);
    res.status(201).json({
      success: true,
      message: "Transfer successful",
      data: transaction,
    }) 
  } catch (error) {
    next(error)
  }
};

exports.getTransactions = async (req, res, next) => {
  try {
  const transactions = await transactionsService.getTransactions(req.query);
    res.status(201).json({
      success: true,
      message: "Transaction details retrieved",
      data: transactions,
    }) 
  } catch (error) {
    next(error)
  }
};


