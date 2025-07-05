import { useState } from 'react';
import { Form, Input, Button, Card, Typography, Alert, Space } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { login } from '../utils/auth';
import './Login.css';

const { Text } = Typography;

const Login = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (values) => {
    setLoading(true);
    setError('');

    try {
      const result = await login(values.username, values.password);

      if (result.success) {
        onLogin(result.user);
      } else {
        setError(result.error);
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container havre-login">
      <div className="login-background">
        <div className="login-overlay">
          <Card className="login-card">
            <div className="login-header">
              <Space direction="vertical" align="center" size="small">
                <div className="havre-login-icon">
                  <div className="havre-logo-container">
                    <img
                      src="/PHOTO-2025-06-23-23-40-29.svg"
                      alt="Havre Bakery Logo"
                      className="havre-logo-image"
                    />
                    <div className="havre-logo-text">Admin Portal</div>
                    <div className="havre-logo-subtitle">Please sign in to continue</div>
                  </div>
                </div>
              </Space>
            </div>

            <Form
              name="login"
              onFinish={handleSubmit}
              autoComplete="off"
              size="middle"
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
                  size="middle"
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </Button>
              </Form.Item>
            </Form>

            <div className="login-footer">
              <Text type="secondary" style={{ fontSize: '11px' }}>
                Demo: admin / admin123
              </Text>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
