const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc    Get products for public website
// @route   GET /website/products
// @access  Public
const getPublicProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    
    const filter = { isActive: true };
    
    if (req.query.category) {
      filter.category = req.query.category;
    }
    
    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }

    const products = await Product.find(filter)
      .select('name description price category images rating')
      .sort({ isFeatured: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      products,
      pagination: {
        current: page,
        pageSize: limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get public products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting products'
    });
  }
};

// @desc    Get featured products
// @route   GET /website/products/featured
// @access  Public
const getFeaturedProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    
    const products = await Product.find({ 
      isActive: true, 
      isFeatured: true 
    })
    .select('name description price category images rating')
    .sort({ 'rating.average': -1, salesCount: -1 })
    .limit(limit)
    .lean();

    res.json({
      success: true,
      products
    });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting featured products'
    });
  }
};

// @desc    Get products by category
// @route   GET /website/products/category/:category
// @access  Public
const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    
    const products = await Product.find({ 
      isActive: true, 
      category: category 
    })
    .select('name description price category images rating')
    .sort({ isFeatured: -1, 'rating.average': -1 })
    .skip(skip)
    .limit(limit)
    .lean();

    const total = await Product.countDocuments({ 
      isActive: true, 
      category: category 
    });

    res.json({
      success: true,
      products,
      category,
      pagination: {
        current: page,
        pageSize: limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get products by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting products by category'
    });
  }
};

// @desc    Submit contact form
// @route   POST /website/contact
// @access  Public
const submitContactForm = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required'
      });
    }

    // Here you would typically save to database or send email
    // For now, we'll just log it
    console.log('Contact form submission:', {
      name,
      email,
      phone,
      subject,
      message,
      timestamp: new Date()
    });

    res.json({
      success: true,
      message: 'Thank you for your message! We will get back to you soon.'
    });
  } catch (error) {
    console.error('Submit contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error submitting contact form'
    });
  }
};

// @desc    Subscribe to newsletter
// @route   POST /website/newsletter
// @access  Public
const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Basic email validation
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address'
      });
    }

    // Here you would typically save to database or add to mailing list
    console.log('Newsletter subscription:', {
      email,
      timestamp: new Date()
    });

    res.json({
      success: true,
      message: 'Thank you for subscribing to our newsletter!'
    });
  } catch (error) {
    console.error('Subscribe newsletter error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error subscribing to newsletter'
    });
  }
};

// @desc    Get website statistics
// @route   GET /website/stats
// @access  Public
const getWebsiteStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments({ isActive: true });
    const totalOrders = await Order.countDocuments();
    const categories = await Product.distinct('category', { isActive: true });
    
    // Get some basic stats without sensitive information
    const stats = {
      totalProducts,
      totalCategories: categories.length,
      categories,
      totalOrdersServed: totalOrders,
      establishedYear: 2020 // You can make this dynamic
    };

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Get website stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting website statistics'
    });
  }
};

module.exports = {
  getPublicProducts,
  getFeaturedProducts,
  getProductsByCategory,
  submitContactForm,
  subscribeNewsletter,
  getWebsiteStats,
};
