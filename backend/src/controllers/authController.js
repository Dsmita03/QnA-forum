// backend/controllers/authController.js

import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Helper: Generate JWT
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// =====================
// SIGNUP
// =====================
export const signup = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Check required
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // Check if user exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      email,
      password: hashed,
      role: role || 'user', // default to user
    });

    // Token
    const token = generateToken(user);

    res.status(201).json({
      message: 'User created successfully!',
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// =====================
// LOGIN
// =====================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check required
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // Token
    const token = generateToken(user);

    res.status(200).json({
      message: 'Logged in successfully!',
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

export const getTotalNoOfUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users.length);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
}