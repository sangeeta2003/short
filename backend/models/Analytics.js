const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  url: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Url',
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  ipAddress: String,
  userAgent: String,
  referrer: String,
  country: String,
  city: String,
  deviceType: String,
  browser: String,
  operatingSystem: String
});

module.exports = mongoose.model('Analytics', analyticsSchema); 