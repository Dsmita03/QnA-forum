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
    const { name,email, password, role } = req.body;

    // Check required
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required.' });
    }

    // Check if user exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'User already exists.' });
    }
    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({
      name,
      email,
      password: hashed,
      role: role || 'user',
    });
    const token = generateToken(user);
      res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // true in production
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
     res.status(201).json({
      message: 'User created successfully!',
      user: {
        id: user._id,
        name: user.name,
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

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: 'Logged in successfully!',
      user: {
        id: user._id,
         name: user.name,
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
    const count = await User.countDocuments();  
    res.status(200).json({ count });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user count" });
  }
};



// export const getUserById = async (req, res) => {
//   console.log(req.user);
//   const id = req.user.id;
//   console.log(id);
//   try {
//     const user = await User.findById(id);
//     res.status(200).json(user);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch user" });
//   }
// }
export const getUserById = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      id: user._id,
      name: user.name,       
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
};
