const express = require('express');
const controller = require('../controllers/transactions.controller');
const validate = require('../middleware/validate');
const requireAuth = require('../middleware/auth');
const { nameEnquirySchema, transferSchema } = require('../validation/transactions.validation');

const router = express.Router();

router.use(requireAuth);

router.post('/name-enquiry', validate(nameEnquirySchema), controller.nameEnquiry);
router.post('/transfer', validate(transferSchema), controller.transfer);
router.post('/:reference/reconcile', controller.reconcile);
router.get('/account/:accountNumber', controller.findByAccount);
router.get('/:reference', controller.findOne);

module.exports = router;
