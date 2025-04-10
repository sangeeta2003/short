const express = require('express');
const router = express.Router();
const Analytics = require('../models/Analytics');
const Url = require('../models/Url');
const auth = require('../middleware/auth');

// Get analytics for a specific URL
router.get('/url/:urlId', auth, async (req, res) => {
  try {
    const url = await Url.findOne({ _id: req.params.urlId, createdBy: req.userId });
    if (!url) {
      return res.status(404).json({ message: 'URL not found' });
    }

    const analytics = await Analytics.find({ url: url._id })
      .sort({ timestamp: -1 });

    // Aggregate statistics
    const stats = {
      totalClicks: analytics.length,
      clicksByCountry: {},
      clicksByDevice: {},
      clicksByBrowser: {},
      clicksByOS: {},
      clicksByDay: {},
      last24Hours: analytics.filter(a => 
        new Date() - a.timestamp < 24 * 60 * 60 * 1000
      ).length
    };

    analytics.forEach(visit => {
      // Country stats
      if (visit.country) {
        stats.clicksByCountry[visit.country] = (stats.clicksByCountry[visit.country] || 0) + 1;
      }

      // Device stats
      if (visit.deviceType) {
        stats.clicksByDevice[visit.deviceType] = (stats.clicksByDevice[visit.deviceType] || 0) + 1;
      }

      // Browser stats
      if (visit.browser) {
        stats.clicksByBrowser[visit.browser] = (stats.clicksByBrowser[visit.browser] || 0) + 1;
      }

      // OS stats
      if (visit.operatingSystem) {
        stats.clicksByOS[visit.operatingSystem] = (stats.clicksByOS[visit.operatingSystem] || 0) + 1;
      }

      // Daily stats
      const day = visit.timestamp.toISOString().split('T')[0];
      stats.clicksByDay[day] = (stats.clicksByDay[day] || 0) + 1;
    });

    res.json({
      url: url,
      analytics: analytics,
      statistics: stats
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's overall analytics
router.get('/user', auth, async (req, res) => {
  try {
    const urls = await Url.find({ createdBy: req.userId });
    const urlIds = urls.map(url => url._id);

    const analytics = await Analytics.find({ url: { $in: urlIds } })
      .sort({ timestamp: -1 });

    // Aggregate overall statistics
    const stats = {
      totalClicks: analytics.length,
      totalUrls: urls.length,
      clicksByCountry: {},
      clicksByDevice: {},
      clicksByBrowser: {},
      clicksByOS: {},
      clicksByDay: {},
      last24Hours: analytics.filter(a => 
        new Date() - a.timestamp < 24 * 60 * 60 * 1000
      ).length
    };

    analytics.forEach(visit => {
      // Country stats
      if (visit.country) {
        stats.clicksByCountry[visit.country] = (stats.clicksByCountry[visit.country] || 0) + 1;
      }

      // Device stats
      if (visit.deviceType) {
        stats.clicksByDevice[visit.deviceType] = (stats.clicksByDevice[visit.deviceType] || 0) + 1;
      }

      // Browser stats
      if (visit.browser) {
        stats.clicksByBrowser[visit.browser] = (stats.clicksByBrowser[visit.browser] || 0) + 1;
      }

      // OS stats
      if (visit.operatingSystem) {
        stats.clicksByOS[visit.operatingSystem] = (stats.clicksByOS[visit.operatingSystem] || 0) + 1;
      }

      // Daily stats
      const day = visit.timestamp.toISOString().split('T')[0];
      stats.clicksByDay[day] = (stats.clicksByDay[day] || 0) + 1;
    });

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 