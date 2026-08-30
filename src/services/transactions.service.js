const { v4: uuidv4 } = require('uuid');
const { Transaction, TRANSACTION_STATUS } = require('../models/transaction.model');
const accountsService = require('./accounts.service');
const nibssPhoenixClient = require('../integrations/nibss-phoenix/nibssPhoenixClient');
const ApiError = require('../utils/ApiError');

async function nameEnquiry({ accountNumber, bankCode }) {
  return nibssPhoenixClient.nameEnquiry(accountNumber, bankCode);
}

/**
 * Core banking money-movement flow:
 *  1. Confirm the source account exists locally.
 *  2. Generate an idempotent reference and persist a PENDING record
 *     *before* calling NIBSS, so a crash mid-call is still recoverable
 *     via reconciliation against transactionStatusQuery.
 *  3. Call NIBSS to actually move funds.
 *  4. Update the local record with the outcome.
 */
async function transfer(dto) {
  const sourceAccount = await accountsService.findByAccountNumber(
    dto.sourceAccountNumber,
  );

  const reference = uuidv4();

  const transaction = await Transaction.create({
    sourceAccountId: sourceAccount._id,
    sourceAccountNumber: dto.sourceAccountNumber,
    destinationAccountNumber: dto.destinationAccountNumber,
    destinationBankCode: dto.destinationBankCode,
    amount: dto.amount,
    narration: dto.narration,
    reference,
    status: TRANSACTION_STATUS.PENDING,
  });

  try {
    const result = await nibssPhoenixClient.fundTransfer({
      sourceAccountNumber: dto.sourceAccountNumber,
      destinationAccountNumber: dto.destinationAccountNumber,
      destinationBankCode: dto.destinationBankCode,
      amount: dto.amount,
      narration: dto.narration,
      reference,
    });

    transaction.status =
      result.status === 'SUCCESSFUL'
        ? TRANSACTION_STATUS.SUCCESSFUL
        : result.status === 'FAILED'
          ? TRANSACTION_STATUS.FAILED
          : TRANSACTION_STATUS.PENDING;
    transaction.nibssSessionId = result.sessionId;
    if (result.status === 'FAILED') {
      transaction.failureReason = result.message;
    }
  } catch (err) {
    transaction.status = TRANSACTION_STATUS.FAILED;
    transaction.failureReason = err.message || 'Unknown error';
  }

  await transaction.save();
  return transaction;
}

/** Reconciles a PENDING local transaction against NIBSS's own status. */
async function reconcile(reference) {
  const transaction = await Transaction.findOne({ reference });
  if (!transaction) throw new ApiError(404, 'Transaction not found');

  const statusResult = await nibssPhoenixClient.transactionStatusQuery(reference);

  if (statusResult.status === 'SUCCESSFUL') {
    transaction.status = TRANSACTION_STATUS.SUCCESSFUL;
  } else if (statusResult.status === 'FAILED') {
    transaction.status = TRANSACTION_STATUS.FAILED;
    transaction.failureReason = statusResult.message;
  }

  await transaction.save();
  return transaction;
}

async function findByAccount(accountNumber) {
  return Transaction.find({ sourceAccountNumber: accountNumber }).sort({
    createdAt: -1,
  });
}

async function findByReference(reference) {
  const transaction = await Transaction.findOne({ reference });
  if (!transaction) throw new ApiError(404, 'Transaction not found');
  return transaction;
}

module.exports = { nameEnquiry, transfer, reconcile, findByAccount, findByReference };
