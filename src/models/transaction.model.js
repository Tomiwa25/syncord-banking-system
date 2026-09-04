const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    reference: { 
      type: String, 
      required: true, 
      unique: true 
    },
    externalTransactionId: {
      type: String,
      index: true
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
      index: true,
    },
    sourceAccount: { 
      type: String, 
    },
    type: { 
      type: String, 
      required: true,
      enum: [
        "TRANSFER"
      ] 
    },
    destinationAccount: { 
      type: String,
      required: true 
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "NGN"
    },
    narration: {
      type: String,
      trim: true
    },
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
