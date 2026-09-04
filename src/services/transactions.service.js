const Transaction = require('../models/transaction.model');
const Account = require('../models/account.model');
const nibssAccountApi = require("../integrations/nibss/account.api");
const nibssTransactionApi = require("../integrations/nibss/transaction.api");

const generateReferenceNumber = () => {
  return `TXN-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
};

exports.transfer = async ({
  sourceAccount,
  destinationAccount,
  amount,
  narration,
}) => {
 if (amount <= 0) {
    throw new Error('Amount must be greater than zero');
 }
 const sender = await Account.findOne({
    accountNumber: sourceAccount,
 });

 if (!sender) {
    throw new Error('Account is not found');
} 
  if (sender.status !== "ACTIVE") {
    throw new Error('Account is not active');
}
  //1. Check recipient name
  const recipient = 
    await nibssAccountApi.nameEnquiry(destinationAccount);

  //2. Call NIBSS transfer
  const result = 
    await nibssAccountApi.transfer({
      from: sourceAccount,
      to: destinationAccount,
      amount: String(amount)
    })
    //3. Save transaction locally
  const transaction =
    await Transaction.create({
      reference: generateReference(),
      externalTransactionId: result.transactionId,
      type: "TRANSFER",
      sourceAccount,
      destinationAccount,
      amount: result.amount,
      narration,
      status: 
        result.status === "SUCCESS" ? "SUCCESS" : "PROCESSING",
 });
 return {
  transaction,
  recipient
 }
};

exports.getTransaction = async (transactionId) => {
  const result = 
    await nibssTransactionApi.getTransaction(transactionId);
  return result;
};

exports.getTransactions = async (filters) => { 
  return (await Transaction.find(filters)).sort({
      createdAt: -1
  });
};