const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Link = require('../models/Link');
const shortid = require('shortid');

// Get all links for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const links = await Link.find({ user: req.user.userId });
    res.json(links);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new link
router.post('/', auth, async (req, res) => {
  try {
    const { originalUrl, customAlias, expirationDate } = req.body;

    // Generate short URL
    let shortUrl;
    if (customAlias) {
      // Check if custom alias is already taken
      const existingLink = await Link.findOne({ customAlias });
      if (existingLink) {
        return res.status(400).json({ message: 'Custom alias already in use' });
      }
      shortUrl = customAlias;
    } else {
      shortUrl = shortid.generate();
    }

    // Create new link
    const link = new Link({
      originalUrl,
      shortUrl,
      customAlias,
      expirationDate: expirationDate ? new Date(expirationDate) : undefined,
      user: req.user.userId,
    });

    await link.save();
    res.status(201).json(link);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Redirect to original URL
router.get('/:shortUrl', async (req, res) => {
  try {
    const link = await Link.findOne({ shortUrl: req.params.shortUrl });
    
    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }

    if (!link.isActive) {
      return res.status(400).json({ message: 'Link is inactive' });
    }

    if (link.expirationDate && new Date() > link.expirationDate) {
      link.isActive = false;
      await link.save();
      return res.status(400).json({ message: 'Link has expired' });
    }

    // Increment click count
    link.clicks += 1;
    await link.save();

    // Redirect to original URL
    res.redirect(link.originalUrl);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 