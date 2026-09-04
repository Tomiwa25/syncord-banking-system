const jwt = require('jsonwebtoken');
const env = require('../config/env');
const User = require('../models/user');

const generateToken = (userId) => {
  return jwt.sign({ userId }, env.jwt.secret, { expiresIn: "1d" });
}

exports.register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = await User.create({ email, password });
    const token = generateToken(newUser._id);
    res.status(201).json({ message: "User registered successfuly", data: { user: newUser, token } });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const foundUser = await User.findOne({ email }).select('+password');

    if (!foundUser) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await foundUser.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(foundUser._id);
    res.json({ message: "Login successful", data: { user: foundUser, token } });
  } catch (error) {
    next(error);
  }
};

exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    res.json({ data: { user } });
  } catch (error) {
    next(error);
  }
};

exports.currentUser = exports.getCurrentUser;


