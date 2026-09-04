const Account = require("../models/account.model");
const Customer = require("../models/customer.model");
const nibssIdentityApi = require("../integrations/nibss/identity.api");
const nibssAccountApi = require("../integrations/nibss/account.api");

const createAccount = async ({customerId, kycType }) => {
  const customer = await Customer.findById(customerId);
  if (!customer) {
    throw new Error("Customer not found");
  }
 let kycID;
 let dob;

 if (kycType.toLowercase() === "bvn") {
  kycID = customer.bvn;
 } else if (kycType.toLowercase() === "nin") {
  kycID = customer.nin;
 } else {
  throw new Error("Invalid Credentials");
 }
   
 if (!kycID) {
  throw new Error(`${kycType.toUpperCase()} not found for the customer`);
 }
  //Validate identity first 
 let identity;

 if (kycType.toLowercase() === "bvn") {
  identity = await nibssIdentityApi.validateBvn(
    kycID
  );
 } else {
  identity = await nibssIdentityApi.validateNin(
    kycID
  );
 }

 if (!identity.valid) {
  throw new Error(
    `${kycType.toUpperCase()} validation failed`
  );
 }

dob = customer.dateOfBirth
 .toISOString()
 .split("T")[0];

 const result = await nibssAccountApi.createAccount({
  kycType: kycType.toLowercase(),
  kycID,
  dob
 });

 const account = await Account.create({
  customer: customer.id,
  accountNumber: result.accountNumber,
  bankCode: result.bankCode,
  bankName: result.bankName,
  balance: result.balance,
  status: "ACTIVE",
 });
  return account;
};

const getAccountById = async (accountNumber) => {
  const account = await Account.findOne({ accountNumber }).populate("customer");
  if (!account) {
    throw new Error("Account not found");
  }
  return account;
};

const getCustomerAccounts = async (customerId) => {
  const accounts = await Account.find({ customer: customerId });
  if (!accounts || accounts.length === 0) {
    throw new Error("No accounts found for this customer");
  }
  return accounts;
};

const getBalance = async (accountNumber) => {
  return nibssAccountApi.getBalance(accountNumber);
};

const nameEnquiry = async (accountNumber) => {
  return nibssAccountApi.nameEnquiry(accountNumber);
};

const getAllAccounts = async () => {
  return nibssAccountApi.getAllAccounts();
};

module.exports = {
  createAccount,
  getAccountById,
  getCustomerAccounts,
  getBalance,
  nameEnquiry,
  getAllAccounts
}