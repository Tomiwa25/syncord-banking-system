const mongoose = require('mongoose');

const ONBOARDING_STATUS = {
  PENDING_KYC: 'PENDING_KYC',
  KYC_VERIFIED: 'KYC_VERIFIED',
  KYC_FAILED: 'KYC_FAILED',
  ONBOARDED: 'ONBOARDED',
};

const customerSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    middleName: { type: String },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phoneNumber: { type: String, required: true, unique: true },
    bvn: { type: String, required: true, unique: true },
    dateOfBirth: { type: String, required: true },
    address: { type: String, required: true },
    gender: { type: String },
    passwordHash: { type: String, select: false },
    onboardingStatus: {
      type: String,
      enum: Object.values(ONBOARDING_STATUS),
      default: ONBOARDING_STATUS.PENDING_KYC,
    },
    bvnVerification: { type: mongoose.Schema.Types.Mixed },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        delete ret.passwordHash;
        return ret;
      },
    },
  },
);

const Customer = mongoose.model('Customer', customerSchema);

module.exports = { Customer, ONBOARDING_STATUS };
