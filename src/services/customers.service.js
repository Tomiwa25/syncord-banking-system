const Customer = require('../models/customer.model')

exports.createCustomer = async (data) => {
  const existingCustomer = await Customer.findOne({ email: data.email });

  if (existingCustomer) {
    throw new Error("Customer already exist")
  }
  return Customer.create(data)
}

const getCustomerById = async (id) => {
  const customer = await Customer.findById(id);

  if (!customer) {
    throw new Error("Customer not found");
  }
  return customer;
};

const getCustomers = async () => {
  return Customer.find().sort({
    createdAt: -1,
  });
};

const updateCustomer = async (id, data) => {
  const customer = await Customer.findByIdAndUpdate(
    id,
    data,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!customer) {
    throw new Error("Customer not found");
  }
  return customer;
};