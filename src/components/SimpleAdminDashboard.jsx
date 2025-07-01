import React from 'react';
import { Layout, Menu, Button, Typography, Space } from 'antd';
import { 
  DashboardOutlined, 
  ShoppingOutlined, 
  ProductOutlined, 
  UserOutlined,
  LogoutOutlined,
  ShopOutlined
} from '@ant-design/icons';
import { logout } from '../utils/auth';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const SimpleAdminDashboard = ({ user, onLogout }) => {
  const handleLogout = () => {
    logout();
    onLogout();
  };

  return (
    <Layout style={{ minHeight: '100vh', width: '100vw', display: 'flex' }}>
      <Sider
        theme="light"
        width={250}
        style={{
          boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
          flexShrink: 0,
        }}
      >
        <div style={{ 
          padding: '24px 16px', 
          borderBottom: '1px solid #f0f0f0',
          textAlign: 'center'
        }}>
          <Space direction="vertical" size="small">
            <ShopOutlined style={{ fontSize: '32px', color: '#1890ff' }} />
            <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
              Bakery Admin
            </Title>
          </Space>
        </div>
        
        <Menu
          mode="inline"
          defaultSelectedKeys={['dashboard']}
          style={{ border: 'none', paddingTop: '16px' }}
        >
          <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
            Dashboard
          </Menu.Item>
          <Menu.Item key="orders" icon={<ShoppingOutlined />}>
            Orders
          </Menu.Item>
          <Menu.Item key="products" icon={<ProductOutlined />}>
            Products
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header style={{
          background: '#fff',
          padding: '0 24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0,
        }}>
          <Title level={3} style={{ margin: 0 }}>
            Admin Panel
          </Title>
          
          <Button 
            type="primary" 
            icon={<LogoutOutlined />}
            onClick={handleLogout}
          >
            Logout ({user?.username})
          </Button>
        </Header>

        <Content style={{
          margin: '24px',
          padding: '24px',
          background: '#fff',
          borderRadius: '8px',
          flex: 1,
          overflow: 'auto',
        }}>
          <div style={{ width: '100%', minHeight: '500px' }}>
            <Title level={2}>🎂 Bakery Admin Dashboard</Title>
            <div style={{
              background: '#f0f2f5',
              padding: '40px',
              borderRadius: '8px',
              textAlign: 'center',
              marginTop: '20px',
              border: '2px solid #1890ff',
              minHeight: '400px'
            }}>
              <h3>Welcome to your Bakery Admin Panel!</h3>
              <p>Logged in as: <strong>{user?.username}</strong></p>
              <p>Login time: {user?.loginTime ? new Date(user.loginTime).toLocaleString() : 'Unknown'}</p>
              <div style={{ marginTop: '30px' }}>
                <h4>Coming Soon:</h4>
                <ul style={{ textAlign: 'left', display: 'inline-block' }}>
                  <li>📊 Sales Dashboard with Charts</li>
                  <li>📋 Order Management System</li>
                  <li>🧁 Product Management (CRUD)</li>
                  <li>🖨️ Invoice Generation & Printing</li>
                  <li>📈 Analytics & Reports</li>
                </ul>
              </div>
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default SimpleAdminDashboard;
