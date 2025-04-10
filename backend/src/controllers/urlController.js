const Url = require('../models/Url');
const { UAParser } = require('ua-parser-js');
const crypto = require('crypto');

// Redirect to original URL
exports.redirectToUrl = async (req, res) => {
  try {
    console.log('Redirect request received for shortCode:', req.params.shortCode);
    
    const { shortCode } = req.params;
    console.log('Searching for URL with shortCode:', shortCode);
    
    const url = await Url.findOne({ shortCode });
    console.log('Database query result:', url);

    if (!url) {
      console.log('URL not found in database');
      return res.status(404).json({ message: 'URL not found' });
    }

    // Check if URL is expired
    if (url.expirationDate && new Date(url.expirationDate) < new Date()) {
      console.log('URL has expired:', url.expirationDate);
      return res.status(410).json({ message: 'URL has expired' });
    }

    // Get device info
    const parser = new UAParser(req.headers['user-agent']);
    const deviceInfo = parser.getDevice();
    const browserInfo = parser.getBrowser();

    console.log('Device info:', {
      deviceType: deviceInfo.type || 'unknown',
      browser: browserInfo.name || 'unknown',
      os: parser.getOS().name || 'unknown'
    });

    // Log click
    url.clicks += 1;
    url.clickHistory.push({
      timestamp: new Date(),
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      deviceType: deviceInfo.type || 'unknown',
      browser: browserInfo.name || 'unknown',
      os: parser.getOS().name || 'unknown'
    });

    await url.save();
    console.log('Click logged successfully');
    console.log('Redirecting to:', url.originalUrl);

    // Redirect to the original URL
    res.redirect(url.originalUrl);
  } catch (error) {
    console.error('Redirect error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create short URL
exports.createShortUrl = async (req, res) => {
  try {
    const { originalUrl, customAlias } = req.body;

    // Generate short code
    const shortCode = customAlias || crypto.randomBytes(5).toString('base64').replace(/[/+]/g, '_');
    const shortUrl = `http://localhost:5000/${shortCode}`;

    // Check if short code already exists
    const existingUrl = await Url.findOne({ shortUrl });
    if (existingUrl) {
      return res.status(400).json({ message: 'Custom alias already in use' });
    }

    const url = new Url({
      originalUrl,
      shortUrl,
      createdBy: req.user.id
    });

    await url.save();
    res.status(201).json(url);
  } catch (error) {
    console.error('Create URL error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user's URLs
exports.getUserUrls = async (req, res) => {
  try {
    const urls = await Url.find({ createdBy: req.user.id })
      .sort({ createdAt: -1 });
    res.json(urls);
  } catch (error) {
    console.error('Get URLs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get URL analytics
exports.getUrlAnalytics = async (req, res) => {
  try {
    const url = await Url.findOne({
      _id: req.params.id,
      createdBy: req.user.id
    });

    if (!url) {
      return res.status(404).json({ message: 'URL not found' });
    }

    res.json(url);
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user analytics
exports.getUserAnalytics = async (req, res) => {
  try {
    const urls = await Url.find({ userId: req.user.id });
    
    // Calculate statistics
    const totalLinks = urls.length;
    const totalClicks = urls.reduce((sum, url) => sum + url.clicks, 0);
    const activeLinks = urls.filter(url => !url.expirationDate || new Date(url.expirationDate) > new Date()).length;
    const expiredLinks = totalLinks - activeLinks;

    // Aggregate device stats
    const deviceStats = {};
    urls.forEach(url => {
      url.clickHistory.forEach(click => {
        deviceStats[click.deviceType] = (deviceStats[click.deviceType] || 0) + 1;
      });
    });

    // Get click history
    const clickHistory = urls.reduce((history, url) => {
      url.clickHistory.forEach(click => {
        const date = new Date(click.timestamp).toLocaleDateString();
        const existing = history.find(h => h.date === date);
        if (existing) {
          existing.count += 1;
        } else {
          history.push({ date, count: 1 });
        }
      });
      return history;
    }, []).sort((a, b) => new Date(a.date) - new Date(b.date));

    res.json({
      totalLinks,
      totalClicks,
      activeLinks,
      expiredLinks,
      deviceStats,
      clickHistory,
      urls
    });
  } catch (error) {
    console.error('Get user analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 