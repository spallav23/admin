import { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Typography, Spin, Alert } from 'antd';
import { useApi } from '../hooks/useApi';
import { dashboardService } from '../services';
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

  // API hooks for dashboard data
  const {
    data: statsData,
    loading: statsLoading,
    error: statsError
  } = useApi(dashboardService.getStats, [], {
    immediate: true,
    showErrorMessage: false
  });

  const {
    data: salesData,
    loading: salesLoading
  } = useApi(() => dashboardService.getSalesData('6months'), [], {
    immediate: true,
    showErrorMessage: false
  });

  const {
    data: last30DaysData,
    loading: last30DaysLoading
  } = useApi(dashboardService.getLast30DaysSales, [], {
    immediate: true,
    showErrorMessage: false
  });

  const {
    data: productDistribution,
    loading: productLoading
  } = useApi(dashboardService.getProductSalesDistribution, [], {
    immediate: true,
    showErrorMessage: false
  });

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Fallback to dummy data if API fails
  const stats = statsData || {
    totalRevenue: 28500,
    totalOrders: 1754,
    newCustomers: 234,
    bestSeller: 'Chocolate Cake'
  };

  const chartSalesData = salesData || [
    { name: 'Jan', sales: 4000, orders: 240 },
    { name: 'Feb', sales: 3000, orders: 198 },
    { name: 'Mar', sales: 5000, orders: 300 },
    { name: 'Apr', sales: 4500, orders: 278 },
    { name: 'May', sales: 6000, orders: 389 },
    { name: 'Jun', sales: 5500, orders: 349 },
  ];

  const last30Days = last30DaysData || [
    { day: 'Day 1', sales: 120 },
    { day: 'Day 5', sales: 150 },
    { day: 'Day 10', sales: 180 },
    { day: 'Day 15', sales: 200 },
    { day: 'Day 20', sales: 170 },
    { day: 'Day 25', sales: 220 },
    { day: 'Day 30', sales: 250 },
  ];

  const productSales = productDistribution || [
    { name: 'Cakes', value: 400, color: '#8884d8' },
    { name: 'Pastries', value: 300, color: '#82ca9d' },
    { name: 'Bread', value: 200, color: '#ffc658' },
    { name: 'Cookies', value: 150, color: '#ff7300' },
  ];

  // Show error if stats failed to load
  if (statsError) {
    return (
      <div style={{ padding: isMobile ? '16px' : '24px' }}>
        <Alert
          message="Dashboard Error"
          description="Failed to load dashboard data. Using demo data instead."
          type="warning"
          showIcon
          style={{ marginBottom: '24px' }}
        />
        <Title level={2} style={{ marginBottom: '24px' }}>
          📊 Sales Dashboard
        </Title>
      </div>
    );
  }

  return (
    <Spin spinning={statsLoading} tip="Loading dashboard...">
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
              value={stats.totalRevenue}
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
              value={stats.totalOrders}
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
              value={stats.newCustomers}
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
              value={stats.bestSeller}
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
              <AreaChart data={chartSalesData}>
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
              <LineChart data={last30Days}>
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
                  data={productSales}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {productSales.map((entry, index) => (
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
              <BarChart data={chartSalesData}>
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
    </Spin>
  );
};

export default Dashboard;
