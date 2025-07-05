const express = require('express');
const { body } = require('express-validator');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  deleteProductImage,
  getCategories,
  searchProducts,
  updateStock,
  getLowStockProducts,
  exportProducts
} = require('../controllers/productController');
const { protect, admin, optionalAuth } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// Validation rules
const productValidation = [
  body('name').notEmpty().withMessage('Product name is required')
    .isLength({ max: 100 }).withMessage('Product name cannot exceed 100 characters'),
  body('description').notEmpty().withMessage('Product description is required')
    .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').isIn(['Cakes', 'Pastries', 'Bread', 'Cookies', 'Beverages', 'Seasonal', 'Custom'])
    .withMessage('Invalid category'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
];

const stockValidation = [
  body('quantity').isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer')
];

// Public routes
router.get('/getProducts', optionalAuth, getProducts);
router.get('/getProduct/:id', optionalAuth, getProduct);
router.get('/products/categories', getCategories);
router.get('/products/search', optionalAuth, searchProducts);

// Protected routes (admin only)
router.post('/createProduct', protect, admin, productValidation, createProduct);
router.put('/products/:id', protect, admin, productValidation, updateProduct);
router.delete('/products/:id', protect, admin, deleteProduct);
router.post('/products/:id/images', protect, admin, upload.array('images', 5), uploadProductImages);
router.delete('/products/:id/images/:imageId', protect, admin, deleteProductImage);
router.patch('/products/:id/stock', protect, admin, stockValidation, updateStock);
router.get('/products/low-stock', protect, admin, getLowStockProducts);
router.get('/products/export', protect, admin, exportProducts);

module.exports = router;
