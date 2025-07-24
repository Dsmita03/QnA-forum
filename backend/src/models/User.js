// backend/models/User.js

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['guest', 'user', 'admin'],
      default: 'user',
    },
    name: {
      type: String,
      default: '',
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    phone: {
      type: String,
      default: '',
      trim: true,
    },
    profession: {
      type: String,
      default: '',
      trim: true,
    },
    bio: {
      type: String,
      default: '',
      trim: true,
    },
    avatar: {
      type: String,
      default: '',  
    },
    coverImage: {
      type: String,
      default: '',  
    },
    websiteLink: {
      type: String,
      default: '',
      trim: true,
    },
    rankings: {
      type: String,
      default: '0',
    },
  },
  {
    timestamps: true, // createdAt will be used as joinedDate
  }
);

const User = mongoose.model('User', userSchema);

export default User;
