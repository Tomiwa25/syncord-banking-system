const express = require('express');
const { deposit, withdraw, transfer, getTransactions } = require('../controllers/transactions.controller');
const authenticate = require("../middleware/auth.middleware");

const router = express.Router();

router.post('/deposit', authenticate, deposit);
router.post('/withdraw', authenticate, withdraw);
router.post('/transfer', authenticate, transfer);
router.get('/transactions', authenticate, getTransactions);

module.exports = router;
