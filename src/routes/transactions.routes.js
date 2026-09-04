const express = require('express');
const { transfer, getTransaction, getTransactions } = require('../controllers/transactions.controller');
const { authenticate } = require("../middleware/auth.middleware");

const router = express.Router();

router.post('/transfer', authenticate, transfer);
router.get('/', authenticate, getTransactions);
router.get('/:transactionId', authenticate, getTransaction);

module.exports = router;
