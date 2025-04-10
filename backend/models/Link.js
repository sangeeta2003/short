const mongoose = require('mongoose');
const shortid = require('shortid');

const linkSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true,
  },
  shortUrl: {
    type: String,
    required: true,
    unique: true,
    default: shortid.generate,
  },
  customAlias: {
    type: String,
    unique: true,
    sparse: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  expirationDate: {
    type: Date,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Index for faster queries
linkSchema.index({ shortUrl: 1 });
linkSchema.index({ user: 1 });
linkSchema.index({ customAlias: 1 });

module.exports = mongoose.model('Link', linkSchema); 