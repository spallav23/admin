const express = require('express');
const {
  getPublicProducts,
  getFeaturedProducts,
  getProductsByCategory,
  submitContactForm,
  subscribeNewsletter,
  getWebsiteStats
} = require('../controllers/websiteController');

const router = express.Router();

// Public website routes
router.get('/products', getPublicProducts);
router.get('/products/featured', getFeaturedProducts);
router.get('/products/category/:category', getProductsByCategory);
router.post('/contact', submitContactForm);
router.post('/newsletter', subscribeNewsletter);
router.get('/stats', getWebsiteStats);

module.exports = router;
