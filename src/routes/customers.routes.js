const express = require('express');
const { createCustomer, getCustomerById, getCustomers, updateCustomer } = require('../controllers/customers.controller');
const authenticate = require("../middleware/auth.middleware");

const router = express.Router();
router.post('/createCustomer', authenticate, createCustomer);
router.get('/getCustomerById/:id', authenticate, getCustomerById);
router.get('/getCustomers', authenticate, getCustomers);
router.patch('/updateCustomer/:id', authenticate, updateCustomer);

module.exports = router;
