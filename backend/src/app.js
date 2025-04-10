const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const urlRoutes = require('./routes/urlRoutes');
const authRoutes = require('./routes/authRoutes');
const Url = require('./models/Url');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// Debug route to check all URLs
app.get('/debug/urls', async (req, res) => {
  try {
    const urls = await Url.find({});
    res.json(urls);
  } catch (error) {
    console.error('Debug route error:', error);
    res.status(500).json({ message: 'Error fetching URLs' });
  }
});

// API Routes
app.use('/api/urls', urlRoutes);
app.use('/api/auth', authRoutes);

// Root level route for short URLs (this should be last)
app.get('/:shortCode', async (req, res) => {
  try {
    console.log('Short URL request received:', req.params.shortCode);
    const { shortCode } = req.params;
    
    // Find URL in database
    const url = await Url.findOne({ shortUrl: new RegExp(shortCode + '$') });
    console.log('Found URL:', url);

    if (!url) {
      console.log('URL not found');
      return res.status(404).json({ message: 'URL not found' });
    }

    // Update click count and history
    url.clicks += 1;
    url.clickHistory = url.clickHistory || [];
    url.clickHistory.push({
      timestamp: new Date(),
      ip: req.ip,
      userAgent: req.headers['user-agent']
    });
    await url.save();

    console.log('Redirecting to:', url.originalUrl);
    res.redirect(url.originalUrl);
  } catch (error) {
    console.error('Redirect error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Connect to MongoDB with retry logic
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    
    console.log('Attempting to connect to MongoDB...');
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    
    console.log('MongoDB Connected Successfully');
    
  } catch (err) {
    console.error('MongoDB connection error:', err);
    console.error('Error details:', {
      name: err.name,
      message: err.message,
      code: err.code
    });
    
    // Retry connection after 5 seconds
    console.log('Retrying connection in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};

connectDB();

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  console.log('404 Not Found:', req.url);
  res.status(404).json({ message: 'Not Found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 