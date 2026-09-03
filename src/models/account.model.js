const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    
    accountNumber: { 
      type: String, 
      required: true, 
      unique: true 
    },
    bankCode: {
      type: String,
    },
    bankName: {
      type: String,
    },
    accountType: { 
      type: String, 
      required: true,
      enum: ["SAVINGS", "CURRENT"] 
    },
    currency: { 
      type: String, 
      required: true,
      enum: ["NGN", "USD", "EUR", "GBP"] 
    },
    balance: { 
      type: Number, 
      required: true, 
      default: 0 
    },
    status: {
      type: String,
      enum: ["PENDING", "ACTIVE", "SUSPENDED", "CLOSED"],
      default: "PENDING",
    },
  },
  { timestamps: true },
);

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;
