const transactionsService = require('../services/transactions.service');

exports.transfer = async (req, res, next) => {
  try {
  const result = await transactionsService.transfer(req.body);
    res.status(201).json({
      success: true,
      message: "Transfer successful",
      data: result,
    }) 
  } catch (error) {
    next(error)
  }
};

exports.getTransaction = async (req, res, next) => {
  try {
  const result = await transactionsService.getTransaction(req.params.transactionId);
    res.status(201).json({
      success: true,
      message: "Transaction details retrieved",
      data: result,
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
      message: " All Transaction details retrieved",
      data: transactions,
    }) 
  } catch (error) {
    next(error)
  }
};


