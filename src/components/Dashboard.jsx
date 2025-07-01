import { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Typography } from 'antd';
import { 
  DollarOutlined, 
  ShoppingCartOutlined, 
  UserOutlined, 
  TrophyOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
} from '@ant-design/icons';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

const { Title } = Typography;

// Dummy data for charts
const salesData = [
  { name: 'Jan', sales: 4000, orders: 240 },
  { name: 'Feb', sales: 3000, orders: 198 },
  { name: 'Mar', sales: 5000, orders: 300 },
  { name: 'Apr', sales: 4500, orders: 278 },
  { name: 'May', sales: 6000, orders: 389 },
  { name: 'Jun', sales: 5500, orders: 349 },
];

const last30DaysData = [
  { day: 'Day 1', sales: 120 },
  { day: 'Day 5', sales: 150 },
  { day: 'Day 10', sales: 180 },
  { day: 'Day 15', sales: 200 },
  { day: 'Day 20', sales: 170 },
  { day: 'Day 25', sales: 220 },
  { day: 'Day 30', sales: 250 },
];

const productSalesData = [
  { name: 'Cakes', value: 400, color: '#8884d8' },
  { name: 'Pastries', value: 300, color: '#82ca9d' },
  { name: 'Bread', value: 200, color: '#ffc658' },
  { name: 'Cookies', value: 150, color: '#ff7300' },
];

const Dashboard = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <div style={{ padding: isMobile ? '16px' : '24px' }}>
      <Title level={2} style={{ marginBottom: '24px' }}>
        📊 Sales Dashboard
      </Title>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={28500}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              prefix={<DollarOutlined />}
              suffix="USD"
            />
            <div style={{ marginTop: '8px', color: '#3f8600' }}>
              <ArrowUpOutlined /> 12.5% from last month
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Orders"
              value={1754}
              valueStyle={{ color: '#1890ff' }}
              prefix={<ShoppingCartOutlined />}
            />
            <div style={{ marginTop: '8px', color: '#1890ff' }}>
              <ArrowUpOutlined /> 8.2% from last month
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="New Customers"
              value={234}
              valueStyle={{ color: '#722ed1' }}
              prefix={<UserOutlined />}
            />
            <div style={{ marginTop: '8px', color: '#cf1322' }}>
              <ArrowDownOutlined /> 2.1% from last month
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Best Seller"
              value="Chocolate Cake"
              valueStyle={{ color: '#fa8c16' }}
              prefix={<TrophyOutlined />}
            />
            <div style={{ marginTop: '8px', color: '#3f8600' }}>
              145 units sold
            </div>
          </Card>
        </Col>
      </Row>

      {/* Charts Row */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Overall Sales (6 Months)" style={{ height: isMobile ? '300px' : '400px' }}>
            <ResponsiveContainer width="100%" height={isMobile ? 220 : 300}>
              <AreaChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={isMobile ? 10 : 12} />
                <YAxis fontSize={isMobile ? 10 : 12} />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Last 30 Days Sales" style={{ height: isMobile ? '300px' : '400px' }}>
            <ResponsiveContainer width="100%" height={isMobile ? 220 : 300}>
              <LineChart data={last30DaysData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" fontSize={isMobile ? 10 : 12} />
                <YAxis fontSize={isMobile ? 10 : 12} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#82ca9d"
                  strokeWidth={3}
                  dot={{ fill: '#82ca9d', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Second Row of Charts */}
      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        <Col xs={24} lg={12}>
          <Card title="Product Sales Distribution" style={{ height: '400px' }}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={productSalesData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {productSalesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card title="Monthly Orders vs Sales" style={{ height: '400px' }}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="orders" fill="#8884d8" />
                <Bar dataKey="sales" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
