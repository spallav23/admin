import api from '../config/api';

export const dashboardService = {
  // Get dashboard statistics
  getStats: async () => {
    try {
      const response = await api.get('/dashboard/stats');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch dashboard stats'
      };
    }
  },

  // Get sales data for charts
  getSalesData: async (period = '6months') => {
    try {
      const response = await api.get(`/dashboard/sales?period=${period}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch sales data'
      };
    }
  },

  // Get last 30 days sales
  getLast30DaysSales: async () => {
    try {
      const response = await api.get('/dashboard/sales/last30days');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch last 30 days sales'
      };
    }
  },

  // Get product sales distribution
  getProductSalesDistribution: async () => {
    try {
      const response = await api.get('/dashboard/products/distribution');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch product distribution'
      };
    }
  },

  // Get recent orders
  getRecentOrders: async (limit = 10) => {
    try {
      const response = await api.get(`/dashboard/orders/recent?limit=${limit}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch recent orders'
      };
    }
  },

  // Get top selling products
  getTopProducts: async (limit = 10) => {
    try {
      const response = await api.get(`/dashboard/products/top?limit=${limit}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch top products'
      };
    }
  }
};
