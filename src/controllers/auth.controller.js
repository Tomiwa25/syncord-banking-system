const jwt = require('jsonwebtoken');
const env = require('../config/env');
const user = require('../models/user');

const generateToken = (userId) => {
  return jwt.sign({ userId }, env.jwt.secret, { expiresIn: "1d" });
}

exports.register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const existingUser = await user.findOne({ email});

    if (existingUser) {
      return res.status(400).json({ message: "User already exists"});
    }

    const user = await User.create({ email, password });
    const token = generateToken(user._id);
    res.status(201).json({ message: "User registered successfuly", data: { user, token}});
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const {email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);
    res.json({ message: "Login successful", data: { user, token } });
  } catch (error) {
    next(error);
  }
};

exports.currentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    res.json({ data: { user } });
  } catch (error) {
    next(error);
  }
};


