import api from '../config/api';

export const ordersService = {
  // Get all orders with pagination and filters
  getOrders: async (params = {}) => {
    try {
      const response = await api.get('/orders', { params });
      return {
        success: true,
        data: response.data.orders,
        pagination: response.data.pagination,
        total: response.data.total
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch orders'
      };
    }
  },

  // Get single order by ID
  getOrder: async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch order'
      };
    }
  },

  // Create new order
  createOrder: async (orderData) => {
    try {
      const response = await api.post('/orders', orderData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create order'
      };
    }
  },

  // Update order
  updateOrder: async (orderId, orderData) => {
    try {
      const response = await api.put(`/orders/${orderId}`, orderData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update order'
      };
    }
  },

  // Update order status
  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await api.patch(`/orders/${orderId}/status`, { status });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update order status'
      };
    }
  },

  // Delete order
  deleteOrder: async (orderId) => {
    try {
      await api.delete(`/orders/${orderId}`);
      return {
        success: true
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete order'
      };
    }
  },

  // Get order statistics
  getOrderStats: async (period = 'month') => {
    try {
      const response = await api.get(`/orders/stats?period=${period}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch order statistics'
      };
    }
  },

  // Search orders
  searchOrders: async (query, filters = {}) => {
    try {
      const response = await api.get('/orders/search', {
        params: { q: query, ...filters }
      });
      return {
        success: true,
        data: response.data.orders,
        total: response.data.total
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to search orders'
      };
    }
  },

  // Export orders
  exportOrders: async (format = 'csv', filters = {}) => {
    try {
      const response = await api.get('/orders/export', {
        params: { format, ...filters },
        responseType: 'blob'
      });
      return {
        success: true,
        data: response.data,
        filename: response.headers['content-disposition']?.split('filename=')[1] || `orders.${format}`
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to export orders'
      };
    }
  }
};
