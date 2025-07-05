const express = require('express');
const {
  getStats,
  getSalesData,
  getLast30DaysSales,
  getProductSalesDistribution,
  getRecentOrders,
  getTopProducts
} = require('../controllers/dashboardController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// All dashboard routes require admin access
router.use(protect);
router.use(admin);

// Dashboard routes
router.get('/stats', getStats);
router.get('/sales', getSalesData);
router.get('/sales/last30days', getLast30DaysSales);
router.get('/products/distribution', getProductSalesDistribution);
router.get('/orders/recent', getRecentOrders);
router.get('/products/top', getTopProducts);

module.exports = router;
