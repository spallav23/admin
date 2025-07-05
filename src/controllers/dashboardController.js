const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private/Admin
const getStats = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Current month stats
    const currentMonthOrders = await Order.find({
      createdAt: { $gte: startOfMonth },
      status: { $ne: 'cancelled' }
    });

    // Last month stats for comparison
    const lastMonthOrders = await Order.find({
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
      status: { $ne: 'cancelled' }
    });

    // Calculate totals
    const totalRevenue = currentMonthOrders.reduce((sum, order) => sum + order.total, 0);
    const lastMonthRevenue = lastMonthOrders.reduce((sum, order) => sum + order.total, 0);
    const revenueGrowth = lastMonthRevenue > 0 ? 
      ((totalRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(1) : 0;

    const totalOrders = currentMonthOrders.length;
    const lastMonthOrderCount = lastMonthOrders.length;
    const ordersGrowth = lastMonthOrderCount > 0 ? 
      ((totalOrders - lastMonthOrderCount) / lastMonthOrderCount * 100).toFixed(1) : 0;

    // New customers this month
    const newCustomers = await User.countDocuments({
      createdAt: { $gte: startOfMonth },
      role: 'customer'
    });

    const lastMonthNewCustomers = await User.countDocuments({
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
      role: 'customer'
    });

    const customersGrowth = lastMonthNewCustomers > 0 ? 
      ((newCustomers - lastMonthNewCustomers) / lastMonthNewCustomers * 100).toFixed(1) : 0;

    // Best selling product
    const productSales = {};
    currentMonthOrders.forEach(order => {
      order.items.forEach(item => {
        if (productSales[item.name]) {
          productSales[item.name] += item.quantity;
        } else {
          productSales[item.name] = item.quantity;
        }
      });
    });

    const bestSeller = Object.keys(productSales).reduce((a, b) => 
      productSales[a] > productSales[b] ? a : b, 'No sales yet'
    );

    const bestSellerUnits = productSales[bestSeller] || 0;

    res.json({
      success: true,
      data: {
        totalRevenue,
        revenueGrowth: parseFloat(revenueGrowth),
        totalOrders,
        ordersGrowth: parseFloat(ordersGrowth),
        newCustomers,
        customersGrowth: parseFloat(customersGrowth),
        bestSeller,
        bestSellerUnits
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting dashboard stats'
    });
  }
};

// @desc    Get sales data for charts
// @route   GET /api/dashboard/sales
// @access  Private/Admin
const getSalesData = async (req, res) => {
  try {
    const period = req.query.period || '6months';
    const now = new Date();
    let startDate;

    switch (period) {
      case '6months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1);
        break;
      case '3months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
        break;
      case '1year':
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1);
    }

    const orders = await Order.find({
      createdAt: { $gte: startDate },
      status: { $ne: 'cancelled' }
    }).sort({ createdAt: 1 });

    // Group by month
    const salesByMonth = {};
    orders.forEach(order => {
      const monthKey = order.createdAt.toISOString().slice(0, 7); // YYYY-MM
      if (!salesByMonth[monthKey]) {
        salesByMonth[monthKey] = { sales: 0, orders: 0 };
      }
      salesByMonth[monthKey].sales += order.total;
      salesByMonth[monthKey].orders += 1;
    });

    // Convert to array format
    const data = Object.keys(salesByMonth).map(month => ({
      name: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      sales: Math.round(salesByMonth[month].sales),
      orders: salesByMonth[month].orders
    }));

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Get sales data error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting sales data'
    });
  }
};

// @desc    Get last 30 days sales
// @route   GET /api/dashboard/sales/last30days
// @access  Private/Admin
const getLast30DaysSales = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const orders = await Order.find({
      createdAt: { $gte: thirtyDaysAgo },
      status: { $ne: 'cancelled' }
    }).sort({ createdAt: 1 });

    // Group by day
    const salesByDay = {};
    orders.forEach(order => {
      const dayKey = order.createdAt.toISOString().slice(0, 10); // YYYY-MM-DD
      if (!salesByDay[dayKey]) {
        salesByDay[dayKey] = 0;
      }
      salesByDay[dayKey] += order.total;
    });

    // Create array with all days (including zero sales days)
    const data = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayKey = date.toISOString().slice(0, 10);
      data.push({
        day: `Day ${30 - i}`,
        date: dayKey,
        sales: Math.round(salesByDay[dayKey] || 0)
      });
    }

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Get last 30 days sales error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting last 30 days sales'
    });
  }
};

// @desc    Get product sales distribution
// @route   GET /api/dashboard/products/distribution
// @access  Private/Admin
const getProductSalesDistribution = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const orders = await Order.find({
      createdAt: { $gte: thirtyDaysAgo },
      status: { $ne: 'cancelled' }
    });

    const categoryStats = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        // Get category from product or use a default
        const category = item.category || 'Other';
        if (!categoryStats[category]) {
          categoryStats[category] = { value: 0, count: 0 };
        }
        categoryStats[category].value += item.subtotal;
        categoryStats[category].count += item.quantity;
      });
    });

    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1', '#d084d0'];
    const data = Object.keys(categoryStats).map((category, index) => ({
      name: category,
      value: Math.round(categoryStats[category].value),
      count: categoryStats[category].count,
      color: colors[index % colors.length]
    }));

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Get product distribution error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting product distribution'
    });
  }
};

// @desc    Get recent orders
// @route   GET /api/dashboard/orders/recent
// @access  Private/Admin
const getRecentOrders = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('orderNumber customer total status createdAt')
      .lean();

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('Get recent orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting recent orders'
    });
  }
};

// @desc    Get top selling products
// @route   GET /api/dashboard/products/top
// @access  Private/Admin
const getTopProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const orders = await Order.find({
      createdAt: { $gte: thirtyDaysAgo },
      status: { $ne: 'cancelled' }
    });

    const productStats = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        if (!productStats[item.name]) {
          productStats[item.name] = {
            name: item.name,
            quantity: 0,
            revenue: 0
          };
        }
        productStats[item.name].quantity += item.quantity;
        productStats[item.name].revenue += item.subtotal;
      });
    });

    const topProducts = Object.values(productStats)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, limit)
      .map(product => ({
        ...product,
        revenue: Math.round(product.revenue)
      }));

    res.json({
      success: true,
      data: topProducts
    });
  } catch (error) {
    console.error('Get top products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting top products'
    });
  }
};

module.exports = {
  getStats,
  getSalesData,
  getLast30DaysSales,
  getProductSalesDistribution,
  getRecentOrders,
  getTopProducts,
};
