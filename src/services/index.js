// Export all services from a central location
export { authService } from './authService';
export { dashboardService } from './dashboardService';
export { ordersService } from './ordersService';
export { productsService } from './productsService';

// Export the main API instance
export { default as api } from '../config/api';
