const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createShortUrl,
  getUserUrls,
  getUrlAnalytics,
  getUserAnalytics
} = require('../controllers/urlController');

// Protected routes
router.use(protect);
router.post('/shorten', createShortUrl);
router.get('/my-urls', getUserUrls);
router.get('/analytics/url/:id', getUrlAnalytics);
router.get('/analytics/user', getUserAnalytics);

module.exports = router; 