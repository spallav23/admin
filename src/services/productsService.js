import api from '../config/api';

export const productsService = {
  // Get all products with pagination and filters
  getProducts: async (params = {}) => {
    try {
      const response = await api.get('/api/getProducts', { params });
      return {
        success: true,
        data: response.data.products,
        pagination: response.data.pagination,
        total: response.data.total
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch products'
      };
    }
  },

  // Get single product by ID
  getProduct: async (productId) => {
    try {
      const response = await api.get(`/api/getProduct/${productId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch product'
      };
    }
  },

  // Create new product
  createProduct: async (productData) => {
    try {
      const response = await api.post('/api/createProduct', productData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create product'
      };
    }
  },

  // Update product
  updateProduct: async (productId, productData) => {
    try {
      const response = await api.put(`/products/${productId}`, productData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update product'
      };
    }
  },

  // Delete product
  deleteProduct: async (productId) => {
    try {
      await api.delete(`/products/${productId}`);
      return {
        success: true
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete product'
      };
    }
  },

  // Upload product images
  uploadImages: async (productId, images) => {
    try {
      const formData = new FormData();
      images.forEach((image, index) => {
        formData.append(`images`, image);
      });

      const response = await api.post(`/products/${productId}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to upload images'
      };
    }
  },

  // Delete product image
  deleteImage: async (productId, imageId) => {
    try {
      await api.delete(`/products/${productId}/images/${imageId}`);
      return {
        success: true
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete image'
      };
    }
  },

  // Get product categories
  getCategories: async () => {
    try {
      const response = await api.get('/products/categories');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch categories'
      };
    }
  },

  // Search products
  searchProducts: async (query, filters = {}) => {
    try {
      const response = await api.get('/products/search', {
        params: { q: query, ...filters }
      });
      return {
        success: true,
        data: response.data.products,
        total: response.data.total
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to search products'
      };
    }
  },

  // Update product stock
  updateStock: async (productId, quantity) => {
    try {
      const response = await api.patch(`/products/${productId}/stock`, { quantity });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update stock'
      };
    }
  },

  // Get low stock products
  getLowStockProducts: async (threshold = 10) => {
    try {
      const response = await api.get(`/products/low-stock?threshold=${threshold}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch low stock products'
      };
    }
  },

  // Export products
  exportProducts: async (format = 'csv', filters = {}) => {
    try {
      const response = await api.get('/products/export', {
        params: { format, ...filters },
        responseType: 'blob'
      });
      return {
        success: true,
        data: response.data,
        filename: response.headers['content-disposition']?.split('filename=')[1] || `products.${format}`
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to export products'
      };
    }
  }
};
