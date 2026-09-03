const Transaction = require('../models/transaction.model');
const Account = require('../models/account.model');

const generateReferenceNumber = () => {
  return `TXN-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
};

exports.deposit = async ({
  accountNumber,
  amount,
  narration,
}) => {
 if (amount <= 0) {
    throw new Error('Amount must be greater than zero');
}

  const account = await Account.findOne({
    accountNumber,
  })
  if (!account) {
    throw new Error('Account is not found');
}

  if (account.status !== "ACTIVE") {
    throw new Error('Account is not active');
}

 account.balance += amount;

 await account.save();

 return Transaction.create({
  reference: generateReferenceNumber(),
  type: "DEPOSIT",
  destinationAccount: accountNumber,
  amount,
  narration,
  status: "SUCCESS"
});
};

exports.withdraw = async ({
  accountNumber,
  amount,
  narration,
}) => {
 if (amount <= 0) {
    throw new Error('Amount must be greater than zero');
 }

 const account = await Account.findOne({
    accountNumber,
 })
 if (!account) {
    throw new Error('Account is not found');
}

  if (account.status !== "ACTIVE") {
    throw new Error('Account is not active');
}

if (account.balance < amount) {
  throw new Error("Insufficient balance")
}
 account.balance -= amount;

 await account.save();

 return Transaction.create({
  reference: generateReferenceNumber(),
  type: "WITHDRAWAL",
  destinationAccount: accountNumber,
  amount,
  narration,
  status: "SUCCESS"
});
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
 const source = await Account.findOne({
    accountNumber: sourceAccount,
 });

 const destination = await Account.findOne({
    accountNumber: destinationAccount,
 });

 if (!source || !destination) {
    throw new Error('Account is not found');
} 
  if (source.status !== "ACTIVE" || destination.status !== "ACTIVE") {
    throw new Error('Account is not active');
}
  if (source.balance < amount) {
  throw new Error("Insufficient balance")
}
  source.balance -= amount;
  destination.balance += amount;

 await source.save();
 await destination.save();

 return Transaction.create({
  reference: generateReferenceNumber(),
  type: "TRANSFER",
  sourceAccount,
  destinationAccount,
  amount,
  narration,
  status: "SUCCESS"
 });
};

exports.getTransactions = async (filters) => {
  return Transaction.find(filters).sort({ createdAt: -1 });
};
