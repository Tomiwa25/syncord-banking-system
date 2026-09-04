const express = require('express');
const  { createAccount, getAccountById, getCustomerAccounts, getBalance, nameEnquiry, getAllAccounts } = require('../controllers/accounts.controller');
const { authenticate, authorizeRoles } = require("../middleware/auth.middleware");

const router = express.Router();

router.post('/', authenticate, createAccount);
router.get('/', authenticate, authorizeRoles('ADMIN', 'OPERATIONS', 'SUPPORT'), getAllAccounts);
router.get('/customer/:customerId', authenticate, getCustomerAccounts);
router.get('/:accountNumber', authenticate, getAccountById);
router.get('/:accountNumber/balance', authenticate, getBalance);
router.get('/:accountNumber/name-enquiry', authenticate, nameEnquiry);



module.exports = router;
