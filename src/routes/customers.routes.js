const express = require('express');
const controller = require('../controllers/customers.controller');
const validate = require('../middleware/validate');
const requireAuth = require('../middleware/auth');
const { onboardSchema, updateSchema } = require('../validation/customers.validation');

const router = express.Router();

// Public: this *is* the onboarding entry point.
router.post('/onboard', validate(onboardSchema), controller.onboard);

router.get('/', requireAuth, controller.findAll);
router.get('/:id', requireAuth, controller.findOne);
router.patch('/:id', requireAuth, validate(updateSchema), controller.update);

module.exports = router;
