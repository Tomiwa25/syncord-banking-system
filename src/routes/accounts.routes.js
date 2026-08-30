const express = require('express');
const controller = require('../controllers/accounts.controller');
const validate = require('../middleware/validate');
const requireAuth = require('../middleware/auth');
const { createAccountSchema } = require('../validation/accounts.validation');

const router = express.Router();

router.use(requireAuth);

router.post('/', validate(createAccountSchema), controller.open);
router.get('/customer/:customerId', controller.findByCustomer);
router.get('/:accountNumber', controller.findOne);
router.get('/:accountNumber/balance', controller.syncBalance);

module.exports = router;
