const express = require('express');
const router = express.Router();
const webScanner = require('../services/web-scanner');
const socialMediaMonitor = require('../services/social-media');
const verifyToken = require('../middleware/auth');

// Initialize social media platforms with default rate limits
socialMediaMonitor.registerPlatform('instagram', { rateLimit: 200 });
socialMediaMonitor.registerPlatform('twitter', { rateLimit: 180 });
socialMediaMonitor.registerPlatform('facebook', { rateLimit: 200 });

// Web scanning endpoints
router.post('/scan-web', verifyToken, async (req, res) => {
  try {
    const { urls } = req.body;
    if (!Array.isArray(urls)) {
      return res.status(400).json({ error: 'URLs must be provided as an array' });
    }

    const results = await webScanner.scanMultiplePages(urls);
    res.json({ results });
  } catch (error) {
    console.error('Error scanning web pages:', error);
    res.status(500).json({ error: 'Failed to scan web pages' });
  }
});

// Social media monitoring endpoints
router.post('/monitor-social', verifyToken, async (req, res) => {
  try {
    const { platforms } = req.body;
    if (!platforms || typeof platforms !== 'object') {
      return res.status(400).json({ error: 'Invalid platforms configuration' });
    }

    const results = await socialMediaMonitor.monitorMultiplePlatforms(platforms);
    res.json({ results });
  } catch (error) {
    console.error('Error monitoring social media:', error);
    res.status(500).json({ error: 'Failed to monitor social media platforms' });
  }
});

// Demo endpoint that combines web scanning and social media monitoring
router.post('/demo', verifyToken, async (req, res) => {
  try {
    const { urls, platforms } = req.body;
    
    const [webResults, socialResults] = await Promise.all([
      webScanner.scanMultiplePages(urls),
      socialMediaMonitor.monitorMultiplePlatforms(platforms)
    ]);

    res.json({
      web_scanning: webResults,
      social_media: socialResults
    });
  } catch (error) {
    console.error('Error running demo:', error);
    res.status(500).json({ error: 'Failed to run demo' });
  }
});

module.exports = router;