const { Account, ACCOUNT_STATUS } = require('../models/account.model');
const customersService = require('./customers.service');
const nibssPhoenixClient = require('../integrations/nibss-phoenix/nibssPhoenixClient');
const ApiError = require('../utils/ApiError');

/**
 * Opens a real account via NibssByPhoenix for an already-KYC-verified
 * customer, then mirrors the result locally.
 */
async function openAccount({ customerId }) {
  const customer = await customersService.findById(customerId);

  const nibssAccount = await nibssPhoenixClient.createCustomerAccount({
    bvn: customer.bvn,
    firstName: customer.firstName,
    lastName: customer.lastName,
    middleName: customer.middleName,
    phoneNumber: customer.phoneNumber,
    email: customer.email,
    dateOfBirth: customer.dateOfBirth,
    address: customer.address,
    gender: customer.gender,
  });

  const account = await Account.create({
    customerId: customer._id,
    accountNumber: nibssAccount.accountNumber,
    accountName: nibssAccount.accountName,
    bankCode: nibssAccount.bankCode,
    status:
      nibssAccount.status === 'ACTIVE'
        ? ACCOUNT_STATUS.ACTIVE
        : ACCOUNT_STATUS.PENDING,
  });

  await customersService.markOnboarded(customer._id.toString());

  return account;
}

async function findByCustomer(customerId) {
  return Account.find({ customerId });
}

async function findByAccountNumber(accountNumber) {
  const account = await Account.findOne({ accountNumber });
  if (!account) throw new ApiError(404, 'Account not found');
  return account;
}

/** Pulls a fresh balance from NIBSS and refreshes the local cache. */
async function syncBalance(accountNumber) {
  const account = await findByAccountNumber(accountNumber);
  const balance = await nibssPhoenixClient.balanceEnquiry(accountNumber);

  account.cachedAvailableBalance = balance.availableBalance;
  account.cachedLedgerBalance = balance.ledgerBalance;
  account.lastBalanceSyncAt = new Date();
  await account.save();

  return account;
}

module.exports = { openAccount, findByCustomer, findByAccountNumber, syncBalance };
