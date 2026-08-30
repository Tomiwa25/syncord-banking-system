const mongoose = require('mongoose');

const ACCOUNT_STATUS = {
  ACTIVE: 'ACTIVE',
  PENDING: 'PENDING',
  SUSPENDED: 'SUSPENDED',
  CLOSED: 'CLOSED',
};

const accountSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    // The account number issued by NibssByPhoenix — source of truth lives
    // upstream; this is a local cache/reference for fast lookups and
    // linking to local transaction records.
    accountNumber: { type: String, required: true, unique: true },
    accountName: { type: String, required: true },
    bankCode: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(ACCOUNT_STATUS),
      default: ACCOUNT_STATUS.PENDING,
    },
    // Cached balance snapshot — always re-verify against NIBSS before
    // relying on this for anything money-moves-real-funds critical.
    cachedAvailableBalance: { type: Number, default: 0 },
    cachedLedgerBalance: { type: Number, default: 0 },
    lastBalanceSyncAt: { type: Date },
  },
  { timestamps: true },
);

const Account = mongoose.model('Account', accountSchema);

module.exports = { Account, ACCOUNT_STATUS };
