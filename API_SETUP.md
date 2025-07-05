# Havre Bakery Admin - API Setup Guide

## 🚀 Overview

This admin panel is now equipped with a comprehensive API setup using Axios. The system is designed to work with your backend API while providing fallback functionality for development.

## 📁 File Structure

```
src/
├── config/
│   └── api.js                 # Axios configuration
├── services/
│   ├── index.js              # Service exports
│   ├── authService.js        # Authentication API calls
│   ├── dashboardService.js   # Dashboard data API calls
│   ├── ordersService.js      # Orders management API calls
│   └── productsService.js    # Products management API calls
├── hooks/
│   └── useApi.js             # Custom React hooks for API calls
└── utils/
    └── auth.js               # Updated with API integration
```

## 🔧 Configuration

### Environment Variables (.env)
```env
VITE_API_BASE_URL=http://192.168.1.8:8080/api
VITE_APP_NAME=Havre Bakery Admin
VITE_APP_VERSION=1.0.0
VITE_DEV_MODE=true
VITE_DEBUG_API=true
```

### API Base URL
- **Current**: `http://192.168.1.8:8080/api`
- **Change**: Update `VITE_API_BASE_URL` in `.env` file

## 📡 API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `POST /auth/refresh` - Refresh token
- `GET /auth/profile` - Get user profile
- `PUT /auth/profile` - Update user profile

### Dashboard
- `GET /dashboard/stats` - Dashboard statistics
- `GET /dashboard/sales?period=6months` - Sales data
- `GET /dashboard/sales/last30days` - Last 30 days sales
- `GET /dashboard/products/distribution` - Product sales distribution
- `GET /dashboard/orders/recent?limit=10` - Recent orders
- `GET /dashboard/products/top?limit=10` - Top products

### Orders
- `GET /orders` - Get all orders (with pagination)
- `GET /orders/:id` - Get single order
- `POST /orders` - Create new order
- `PUT /orders/:id` - Update order
- `PATCH /orders/:id/status` - Update order status
- `DELETE /orders/:id` - Delete order
- `GET /orders/stats?period=month` - Order statistics
- `GET /orders/search?q=query` - Search orders
- `GET /orders/export?format=csv` - Export orders

### Products
- `GET /products` - Get all products (with pagination)
- `GET /products/:id` - Get single product
- `POST /products` - Create new product
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product
- `POST /products/:id/images` - Upload product images
- `DELETE /products/:id/images/:imageId` - Delete product image
- `GET /products/categories` - Get product categories
- `GET /products/search?q=query` - Search products
- `PATCH /products/:id/stock` - Update product stock
- `GET /products/low-stock?threshold=10` - Get low stock products
- `GET /products/export?format=csv` - Export products

## 🎯 Usage Examples

### Using Services Directly
```javascript
import { authService, ordersService } from '../services';

// Login
const result = await authService.login({ username, password });

// Get orders
const orders = await ordersService.getOrders({ page: 1, limit: 10 });
```

### Using Custom Hooks
```javascript
import { useApi, usePaginatedApi } from '../hooks/useApi';
import { dashboardService } from '../services';

// Simple API call
const { data, loading, error } = useApi(dashboardService.getStats);

// Paginated API call
const { 
  data, 
  pagination, 
  loading, 
  handleTableChange 
} = usePaginatedApi(ordersService.getOrders);
```

## 🔒 Authentication

The system includes automatic token management:
- **Token Storage**: Stored in secure HTTP-only cookies
- **Auto-Refresh**: Automatic token refresh on expiry
- **Request Interceptor**: Adds Bearer token to all requests
- **Response Interceptor**: Handles 401 errors and redirects to login

## 🛠️ Error Handling

Comprehensive error handling includes:
- **Network Errors**: Connection issues
- **HTTP Errors**: 401, 403, 404, 422, 500 status codes
- **Validation Errors**: Form validation feedback
- **User Feedback**: Automatic error messages via Ant Design

## 📊 Features

### Current Implementation
- ✅ **Axios Configuration** with interceptors
- ✅ **Service Layer** for all API calls
- ✅ **Custom Hooks** for React integration
- ✅ **Error Handling** with user feedback
- ✅ **Loading States** for better UX
- ✅ **Fallback Data** for development
- ✅ **Debug Logging** in development mode

### API Integration Status
- ✅ **Authentication**: Login/logout with API + fallback
- ✅ **Dashboard**: API calls with fallback to dummy data
- 🔄 **Orders**: Ready for API integration
- 🔄 **Products**: Ready for API integration

## 🚀 Next Steps

1. **Update API Base URL**: Change `VITE_API_BASE_URL` in `.env`
2. **Test Endpoints**: Verify your backend API endpoints match
3. **Customize Data Structure**: Adjust service responses to match your API
4. **Add New Endpoints**: Extend services as needed
5. **Remove Fallbacks**: Remove dummy data once API is stable

## 🔧 Customization

### Adding New API Endpoints
1. Add method to appropriate service file
2. Create custom hook if needed
3. Use in components with error handling

### Changing API Structure
1. Update service methods to match your API response format
2. Adjust component data handling
3. Update TypeScript types if using TypeScript

## 📝 Notes

- **Development Mode**: Uses fallback data when API is unavailable
- **Production Ready**: Includes proper error handling and loading states
- **Scalable**: Easy to extend with new endpoints and features
- **Maintainable**: Clean separation of concerns with services and hooks
