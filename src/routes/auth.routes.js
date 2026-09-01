const express = require('express');
const controller = require('../controllers/auth.controller');
const validate = require('../middleware/validate');
const { loginSchema } = require('../validation/auth.validation');

const router = express.Router();

router.post('/login', validate(loginSchema), controller.login);

module.exports = router;
