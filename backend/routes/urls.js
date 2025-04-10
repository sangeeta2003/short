const express = require('express');
const router = express.Router();
const Url = require('../models/Url');
const Analytics = require('../models/Analytics');
const auth = require('../middleware/auth');
const UAParser = require('ua-parser-js');

// Optional geoip-lite import
let geoip;
try {
  geoip = require('geoip-lite');
} catch (error) {
  console.warn('geoip-lite not available, location tracking will be limited');
  geoip = {
    lookup: () => null
  };
}

// Create short URL
router.post('/shorten', auth, async (req, res) => {
  try {
    const { originalUrl } = req.body;
    
    // Validate URL
    if (!originalUrl) {
      return res.status(400).json({ message: 'URL is required' });
    }

    const url = new Url({
      originalUrl,
      createdBy: req.userId
    });
    
    await url.save();
    
    // Return the full short URL
    const shortUrl = `${req.protocol}://${req.get('host')}/${url.shortUrl}`;
    res.json({
      ...url.toJSON(),
      shortUrl
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's URLs
router.get('/my-urls', auth, async (req, res) => {
  try {
    const urls = await Url.find({ createdBy: req.userId }).sort({ createdAt: -1 });
    // Add full short URL to each result
    const urlsWithFullShortUrl = urls.map(url => ({
      ...url.toJSON(),
      shortUrl: `${req.protocol}://${req.get('host')}/${url.shortUrl}`
    }));
    res.json(urlsWithFullShortUrl);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all URLs (admin only)
router.get('/', auth, async (req, res) => {
  try {
    const urls = await Url.find().sort({ createdAt: -1 });
    // Add full short URL to each result
    const urlsWithFullShortUrl = urls.map(url => ({
      ...url.toJSON(),
      shortUrl: `${req.protocol}://${req.get('host')}/${url.shortUrl}`
    }));
    res.json(urlsWithFullShortUrl);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Redirect to original URL
router.get('/:shortUrl', async (req, res) => {
  try {
    const url = await Url.findOne({ shortUrl: req.params.shortUrl });
    if (url) {
      // Update click count
      url.clicks += 1;
      await url.save();

      // Track analytics
      const ip = req.ip || req.connection.remoteAddress;
      const geo = geoip.lookup(ip);
      const ua = new UAParser(req.headers['user-agent']);

      const analytics = new Analytics({
        url: url._id,
        ipAddress: ip,
        userAgent: req.headers['user-agent'],
        referrer: req.headers.referer || 'Direct',
        country: geo?.country || 'Unknown',
        city: geo?.city || 'Unknown',
        deviceType: ua.getDevice().type || 'desktop',
        browser: ua.getBrowser().name || 'Unknown',
        operatingSystem: ua.getOS().name || 'Unknown'
      });

      await analytics.save();

      // Ensure the URL has http:// or https://
      const redirectUrl = url.originalUrl.startsWith('http') 
        ? url.originalUrl 
        : `http://${url.originalUrl}`;
      res.redirect(redirectUrl);
    } else {
      res.status(404).json({ message: 'URL not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 