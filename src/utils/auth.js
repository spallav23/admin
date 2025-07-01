import Cookies from 'js-cookie';

// Static admin credentials
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

// Cookie configuration
const COOKIE_NAME = 'bakery_admin_session';
const COOKIE_OPTIONS = {
  expires: 7, // 7 days
  secure: false, // Set to true in production with HTTPS
  sameSite: 'strict'
};

// Authentication functions
export const login = (username, password) => {
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    const adminData = {
      username: ADMIN_CREDENTIALS.username,
      loginTime: new Date().toISOString(),
      isAuthenticated: true
    };
    
    // Store in cookie
    Cookies.set(COOKIE_NAME, JSON.stringify(adminData), COOKIE_OPTIONS);
    return { success: true, user: adminData };
  }
  
  return { success: false, error: 'Invalid username or password' };
};

export const logout = () => {
  Cookies.remove(COOKIE_NAME);
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
