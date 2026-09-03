const express = require('express');
const { register, login, getCurrentUser }= require('../controllers/auth.controller');
const authenticate = require("../middleware/auth.middleware")

const router = express.Router();
router.post('/register', authenticate, register);
router.post('/login', authenticate, login);
router.post('/getCurrentUser', authenticate, getCurrentUser);


module.exports = router;
