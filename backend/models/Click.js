const mongoose = require('mongoose');

const clickSchema = new mongoose.Schema({
  link: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Link',
    required: true,
  },
  userAgent: {
    type: String,
  },
  deviceType: {
    type: String,
    enum: ['Desktop', 'Mobile', 'Tablet'],
  },
  browser: {
    type: String,
  },
  os: {
    type: String,
  },
  ipAddress: {
    type: String,
  },
  country: {
    type: String,
  },
  city: {
    type: String,
  },
}, {
  timestamps: true,
});

// Index for faster queries
clickSchema.index({ link: 1 });
clickSchema.index({ createdAt: 1 });

module.exports = mongoose.model('Click', clickSchema); 