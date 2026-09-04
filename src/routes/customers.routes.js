const express = require('express');
const { createCustomer, getCustomerById, getCustomers, updateCustomer } = require('../controllers/customers.controller');
const { authenticate, authorizeRoles } = require("../middleware/auth.middleware");

const router = express.Router();
router.post('/createCustomer', authenticate, createCustomer);
router.get('/getCustomerById/:id', authenticate, getCustomerById);
router.get('/getCustomers', authenticate, authorizeRoles('ADMIN', 'OPERATIONS', 'SUPPORT'), getCustomers);
router.patch('/updateCustomer/:id', authenticate, updateCustomer);

module.exports = router;
