import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { isAuthenticated, getAdminData } from './utils/auth';
import './App.css';
import './styles/bakery-theme.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated
    if (isAuthenticated()) {
      const adminData = getAdminData();
      setUser(adminData);
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    navigate('/admin');
  };

  const handleLogout = () => {
    setUser(null);
    navigate('/login');
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#8B4513',
          colorPrimaryHover: '#CD853F',
          colorPrimaryActive: '#5D4E37',
          borderRadius: 8,
          fontFamily: 'Georgia, "Times New Roman", serif',
          colorBgContainer: '#FFFFFF',
          colorBgElevated: '#FFF8DC',
          colorBorder: '#DDD',
          colorText: '#2F1B14',
          colorTextSecondary: '#5D4E37',
        },
      }}
    >
      <div className="App havre-theme">
        <Routes>
          <Route
            path="/login"
            element={
              isAuthenticated() ?
                <Navigate to="/admin" replace /> :
                <Login onLogin={handleLogin} />
            }
          />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminDashboard user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={<Navigate to="/admin" replace />}
          />
        </Routes>
      </div>
    </ConfigProvider>
  );
}

export default App;
