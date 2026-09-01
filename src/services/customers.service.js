const bcrypt = require('bcrypt');
const { Customer, ONBOARDING_STATUS } = require('../models/customer.model');
const nibssPhoenixClient = require('../integrations/nibss-phoenix/nibssPhoenixClient');
const ApiError = require('../utils/ApiError');

/**
 * Full onboarding flow:
 *  1. Reject duplicate email/phone/bvn up front.
 *  2. Validate BVN against NibssByPhoenix.
 *  3. Persist the customer locally with the KYC result attached.
 * Account creation (getting an actual account number from NIBSS) is a
 * separate step handled by accounts.service, so a customer can exist in
 * "KYC_VERIFIED" state before an account is opened for them.
 */
async function onboard(dto) {
  const existing = await Customer.findOne({
    $or: [{ email: dto.email }, { phoneNumber: dto.phoneNumber }, { bvn: dto.bvn }],
  });

  if (existing) {
    throw new ApiError(
      409,
      'A customer with this email, phone number, or BVN already exists',
    );
  }

  const bvnResult = await nibssPhoenixClient.validateBvn(dto.bvn);

  if (!bvnResult.isValid) {
    throw new ApiError(409, 'BVN could not be validated');
  }

  const passwordHash = await bcrypt.hash(dto.password, 10);

  const customer = await Customer.create({
    firstName: dto.firstName,
    lastName: dto.lastName,
    middleName: dto.middleName,
    email: dto.email,
    phoneNumber: dto.phoneNumber,
    bvn: dto.bvn,
    dateOfBirth: dto.dateOfBirth,
    address: dto.address,
    gender: dto.gender,
    passwordHash,
    onboardingStatus: ONBOARDING_STATUS.KYC_VERIFIED,
    bvnVerification: bvnResult,
  });

  return customer;
}

async function findAll() {
  return Customer.find();
}

async function findById(id) {
  const customer = await Customer.findById(id);
  if (!customer) throw new ApiError(404, 'Customer not found');
  return customer;
}

async function findByEmailWithPassword(email) {
  return Customer.findOne({ email }).select('+passwordHash');
}

async function update(id, dto) {
  const customer = await Customer.findByIdAndUpdate(id, dto, { new: true });
  if (!customer) throw new ApiError(404, 'Customer not found');
  return customer;
}

async function markOnboarded(id) {
  const customer = await Customer.findByIdAndUpdate(
    id,
    { onboardingStatus: ONBOARDING_STATUS.ONBOARDED },
    { new: true },
  );
  if (!customer) throw new ApiError(404, 'Customer not found');
  return customer;
}

module.exports = {
  onboard,
  findAll,
  findById,
  findByEmailWithPassword,
  update,
  markOnboarded,
};
