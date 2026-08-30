const authService = require('../services/auth.service');

async function login(req, res) {
  const result = await authService.login(req.body);
  res.json({ success: true, data: result });
}

module.exports = { login };
