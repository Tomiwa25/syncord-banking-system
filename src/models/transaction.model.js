const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    sourceAccountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },
    externalTransactionId: {
      type: String,
      index: true
    },
    sourceAccount: { 
      type: String, 
    },
    destinationAccountNumber: { 
      type: String, 
    },
    type: { 
      type: String, 
      required: true,
      enum: [
        "DEPOSIT",
        "WITHDRAWAL",
        "TRANSFER"
      ] 
    },
    destinationAccountName: {
       type: String 
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    narration: {
      type: String,
      trim: true
    },
    
    reference: { 
      type: String, 
      required: true, 
      unique: true 
    },
    nibssSessionId: { type: String },
    status: {
      type: String,
      enum: [
        "PENDING",
        "PROCESSING",
        "SUCCESS",
        "FAILED"
      ],
      default: "PENDING",
    },
  },
  { timestamps: true },
);

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
