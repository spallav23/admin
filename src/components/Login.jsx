import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Alert, Space } from 'antd';
import { UserOutlined, LockOutlined, ShopOutlined } from '@ant-design/icons';
import { login } from '../utils/auth';
import './Login.css';

const { Title, Text } = Typography;

const Login = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (values) => {
    setLoading(true);
    setError('');

    try {
      const result = login(values.username, values.password);
      
      if (result.success) {
        onLogin(result.user);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="login-overlay">
          <Card className="login-card" bordered={false}>
            <div className="login-header">
              <Space direction="vertical" align="center" size="large">
                <div className="login-icon">
                  <ShopOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
                </div>
                <div className="login-title">
                  <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
                    Bakery Admin Panel
                  </Title>
                  <Text type="secondary">
                    Welcome back! Please sign in to continue.
                  </Text>
                </div>
              </Space>
            </div>

            <Form
              name="login"
              onFinish={handleSubmit}
              autoComplete="off"
              size="large"
              layout="vertical"
            >
              {error && (
                <Form.Item>
                  <Alert
                    message={error}
                    type="error"
                    showIcon
                    closable
                    onClose={() => setError('')}
                  />
                </Form.Item>
              )}

              <Form.Item
                name="username"
                rules={[
                  { required: true, message: 'Please input your username!' }
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Enter username (admin)"
                  autoComplete="username"
                  allowClear
                  maxLength={50}
                  autoFocus
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  { required: true, message: 'Please input your password!' }
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Enter password (admin123)"
                  autoComplete="current-password"
                  maxLength={50}
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  size="large"
                  style={{ height: '48px', fontSize: '16px' }}
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </Button>
              </Form.Item>
            </Form>

            <div className="login-footer">
              <Text type="secondary" style={{ fontSize: '12px' }}>
                Demo Credentials: admin / admin123
              </Text>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
