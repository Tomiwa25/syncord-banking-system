const Customer = require('../models/customer.model');
const User = require('../models/user');
const httpError = require('../utils/httpError');

const staffRoles = ['ADMIN', 'OPERATIONS', 'SUPPORT'];

const getActor = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw httpError('User not found', 401);
  }
  return user;
};

const assertCustomerAccess = (actor, customerId) => {
  if (staffRoles.includes(actor.role)) {
    return;
  }
  if (!actor.customer || String(actor.customer) !== String(customerId)) {
    throw httpError('You do not have permission to access this customer', 403);
  }
};

exports.createCustomer = async (data, userId) => {
  const existingCustomer = await Customer.findOne({ email: data.email });

  if (existingCustomer) {
    throw httpError('Customer already exists', 409);
  }

  const user = await getActor(userId);
  if (user.customer) {
    throw httpError('A customer profile is already linked to this user', 409);
  }

  const customer = await Customer.create(data);
  user.customer = customer._id;
  await user.save();
  return customer;
};

const getCustomerById = async (id, userId) => {
  const actor = await getActor(userId);
  assertCustomerAccess(actor, id);
  const customer = await Customer.findById(id);

  if (!customer) {
    throw httpError('Customer not found', 404);
  }
  return customer;
};

const getCustomers = async () => {
  return Customer.find().sort({
    createdAt: -1,
  });
};

const updateCustomer = async (id, data, userId) => {
  const actor = await getActor(userId);
  assertCustomerAccess(actor, id);
  const customer = await Customer.findByIdAndUpdate(
    id,
    data,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!customer) {
    throw httpError('Customer not found', 404);
  }
  return customer;
};

exports.getCustomerById = getCustomerById;
exports.getCustomers = getCustomers;
exports.updateCustomer = updateCustomer;
