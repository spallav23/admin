import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, Typography, Space, Drawer } from 'antd';
import {
  DashboardOutlined,
  ShoppingOutlined,
  ProductOutlined,
  UserOutlined,
  LogoutOutlined,
  ShopOutlined,
  MenuOutlined
} from '@ant-design/icons';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../utils/auth';
import Dashboard from './Dashboard';
import Orders from './Orders';
import Products from './Products';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const AdminDashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileDrawerVisible, setMobileDrawerVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleLogout = () => {
    logout();
    onLogout();
  };

  const menuItems = [
    {
      key: '/admin',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/admin/orders',
      icon: <ShoppingOutlined />,
      label: 'Orders',
    },
    {
      key: '/admin/products',
      icon: <ProductOutlined />,
      label: 'Products',
    },
  ];

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  const handleMenuClick = ({ key }) => {
    navigate(key);
    if (isMobile) {
      setMobileDrawerVisible(false);
    }
  };

  const toggleMobileDrawer = () => {
    setMobileDrawerVisible(!mobileDrawerVisible);
  };

  const siderContent = (
    <>
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
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={handleMenuClick}
        style={{ border: 'none', paddingTop: '16px' }}
      />
    </>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {!isMobile ? (
        <Sider
          theme="light"
          width={250}
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          style={{
            boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
          }}
        >
          {siderContent}
        </Sider>
      ) : (
        <Drawer
          title="Navigation"
          placement="left"
          onClose={() => setMobileDrawerVisible(false)}
          open={mobileDrawerVisible}
          bodyStyle={{ padding: 0 }}
          width={250}
        >
          {siderContent}
        </Drawer>
      )}

      <Layout>
        <Header style={{
          background: '#fff',
          padding: '0 24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {isMobile && (
              <Button
                type="text"
                icon={<MenuOutlined />}
                onClick={toggleMobileDrawer}
                style={{ marginRight: '16px' }}
              />
            )}
            <Title level={3} style={{ margin: 0 }}>
              Admin Panel
            </Title>
          </div>

          
          <Dropdown
            menu={{ items: userMenuItems }}
            placement="bottomRight"
            trigger={['click']}
          >
            <Button type="text" style={{ height: 'auto', padding: '8px 12px' }}>
              <Space>
                <Avatar icon={<UserOutlined />} size="small" />
                <span>Welcome, {user?.username}</span>
              </Space>
            </Button>
          </Dropdown>
        </Header>

        <Content style={{
          margin: isMobile ? '16px 8px' : '24px',
          padding: '0',
          background: '#fff',
          borderRadius: '8px',
          minHeight: 'calc(100vh - 112px)',
          overflow: 'auto'
        }}>
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="orders" element={<Orders />} />
            <Route path="products" element={<Products />} />
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};



export default AdminDashboard;
