const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
  },
  ip: {
    type: String,
  },
  browser: {
    type: String,
  },
  device: {
    type: String,
  },
  country: {
    type: String,
  },
}, { _id: false });

const urlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: [true, 'Original URL is required'],
    trim: true,
  },
  shortCode: {
    type: String,
    required: [true, 'Short code is required'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Created by user is required'],
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  expiresAt: {
    type: Date,
    default: null,
  },
  analytics: {
    type: [analyticsSchema],
    default: [],
  },
}, {
  timestamps: true,
});

// Index for faster queries
urlSchema.index({ shortCode: 1 });
urlSchema.index({ createdBy: 1 });
urlSchema.index({ expiresAt: 1 });

// Method to check if URL is expired
urlSchema.methods.isExpired = function() {
  if (!this.expiresAt) return false;
  return new Date() > this.expiresAt;
};

// Method to check if URL is active
urlSchema.methods.isActive = function() {
  return !this.disabled && !this.isExpired();
};

module.exports = mongoose.model('Url', urlSchema);

