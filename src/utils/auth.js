import Cookies from 'js-cookie';
import { authService } from '../services/authService';

// Cookie configuration
const COOKIE_NAME = 'havre_admin_session';
const COOKIE_OPTIONS = {
  expires: 7, // 7 days
  secure: false, // Set to true in production with HTTPS
  sameSite: 'strict'
};

// Authentication functions
export const login = async (username, password) => {
  try {
    // Try API login first
    const result = await authService.login({ username, password });

    if (result.success) {
      const adminData = {
        username: result.user.username,
        email: result.user.email,
        role: result.user.role,
        token: result.token,
        loginTime: new Date().toISOString(),
        isAuthenticated: true
      };

      // Store in cookie
      Cookies.set(COOKIE_NAME, JSON.stringify(adminData), COOKIE_OPTIONS);
      return { success: true, user: adminData };
    }

    return result;
  } catch (error) {
    // Fallback to static credentials for development
    if (username === 'admin' && password === 'admin123') {
      const adminData = {
        username: 'admin',
        email: 'admin@havrebakery.com',
        role: 'admin',
        loginTime: new Date().toISOString(),
        isAuthenticated: true
      };

      // Store in cookie
      Cookies.set(COOKIE_NAME, JSON.stringify(adminData), COOKIE_OPTIONS);
      return { success: true, user: adminData };
    }

    return { success: false, error: 'Invalid username or password' };
  }
};

export const logout = async () => {
  try {
    // Try API logout
    // await authService.logout();
  } catch (error) {
    console.error('API logout failed:', error);
  } finally {
    // Always remove local session
    Cookies.remove(COOKIE_NAME);
  }
  return true;
};

export const isAuthenticated = () => {
  try {
    const adminData = Cookies.get(COOKIE_NAME);
    if (!adminData) return false;
    
    const parsed = JSON.parse(adminData);
    return parsed.isAuthenticated === true;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

export const getAdminData = () => {
  try {
    const adminData = Cookies.get(COOKIE_NAME);
    if (!adminData) return null;
    
    return JSON.parse(adminData);
  } catch (error) {
    console.error('Error getting admin data:', error);
    return null;
  }
};

export const updateLastActivity = () => {
  const adminData = getAdminData();
  if (adminData) {
    adminData.lastActivity = new Date().toISOString();
    Cookies.set(COOKIE_NAME, JSON.stringify(adminData), COOKIE_OPTIONS);
  }
};
