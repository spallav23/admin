const express = require('express');
const { body } = require('express-validator');
const {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  updateOrderStatus,
  deleteOrder,
  getOrderStats,
  searchOrders,
  exportOrders
} = require('../controllers/orderController');
const { protect, admin, optionalAuth } = require('../middleware/authMiddleware');

const router = express.Router();

// Validation rules
const orderValidation = [
  body('customer.name').notEmpty().withMessage('Customer name is required'),
  body('customer.email').isEmail().withMessage('Valid customer email is required'),
  body('customer.phone').notEmpty().withMessage('Customer phone is required'),
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.product').notEmpty().withMessage('Product ID is required for each item'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('items.*.price').isFloat({ min: 0 }).withMessage('Price must be positive'),
  body('orderType').isIn(['pickup', 'delivery', 'dine-in']).withMessage('Invalid order type'),
  body('paymentMethod').isIn(['cash', 'card', 'online', 'bank_transfer']).withMessage('Invalid payment method')
];

const statusValidation = [
  body('status').isIn(['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'])
    .withMessage('Invalid order status')
];

// Public routes (for website orders)
router.post('/orders', orderValidation, createOrder);

// Protected routes (admin access)
router.get('/orders', protect, admin, getOrders);
router.get('/orders/stats', protect, admin, getOrderStats);
router.get('/orders/search', protect, admin, searchOrders);
router.get('/orders/export', protect, admin, exportOrders);
router.get('/orders/:id', protect, admin, getOrder);
router.put('/orders/:id', protect, admin, orderValidation, updateOrder);
router.patch('/orders/:id/status', protect, admin, statusValidation, updateOrderStatus);
router.delete('/orders/:id', protect, admin, deleteOrder);

module.exports = router;
