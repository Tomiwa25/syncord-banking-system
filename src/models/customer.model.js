const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema(
  {
    firstName: { 
      type: String, 
      required: true,
      trim: true
    },
    lastName: { 
      type: String, 
      required: true 
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phoneNumber: { 
      type: String, 
      required: true, 
      unique: true 
    },
    bvn: {
      type: String,
      unique: true,
      sparse: true,
    },
    nin: {
      type: String,
      unique: true,
      sparse: true,
    },
    dateOfBirth: {
      type: Date,
      required: true 
    },
    status: {
      type: String,
      enum: ["PENDING", "ACTIVE", "SUSPENDED"],
      default: "PENDING",
    },
  },
  { timestamps: true},
);

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
