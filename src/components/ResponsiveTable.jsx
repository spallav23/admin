import { useState, useEffect } from 'react';
import { Table, Card, Row, Col, Space, Tag, Button, Pagination } from 'antd';

const ResponsiveTable = ({ 
  columns, 
  dataSource, 
  pagination = true, 
  rowKey = 'id',
  loading = false,
  ...props 
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Calculate pagination for mobile cards
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = dataSource.slice(startIndex, endIndex);

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  // Mobile Card View
  const MobileCardView = () => (
    <div>
      <Row gutter={[16, 16]}>
        {paginatedData.map((record, index) => (
          <Col xs={24} key={record[rowKey] || index}>
            <Card 
              className="mobile-table-card"
              style={{ 
                borderRadius: '12px',
                border: '2px solid var(--bakery-accent)',
                background: 'var(--bakery-warm-white)'
              }}
            >
              {columns.map((column) => {
                if (column.key === 'actions') {
                  return (
                    <div key={column.key} style={{ marginTop: '16px', textAlign: 'right' }}>
                      <Space wrap>
                        {typeof column.render === 'function' 
                          ? column.render(record[column.dataIndex], record, index)
                          : record[column.dataIndex]
                        }
                      </Space>
                    </div>
                  );
                }

                const value = record[column.dataIndex];
                const displayValue = typeof column.render === 'function' 
                  ? column.render(value, record, index)
                  : value;

                if (!value && !displayValue) return null;

                return (
                  <div key={column.key || column.dataIndex} style={{ marginBottom: '8px' }}>
                    <Row>
                      <Col xs={8}>
                        <strong style={{ 
                          color: 'var(--bakery-secondary)',
                          fontSize: '13px',
                          fontWeight: 600
                        }}>
                          {column.title}:
                        </strong>
                      </Col>
                      <Col xs={16}>
                        <span style={{ 
                          fontSize: '13px',
                          color: 'var(--bakery-text-dark)'
                        }}>
                          {displayValue}
                        </span>
                      </Col>
                    </Row>
                  </div>
                );
              })}
            </Card>
          </Col>
        ))}
      </Row>
      
      {pagination && dataSource.length > pageSize && (
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={dataSource.length}
            onChange={handlePageChange}
            showSizeChanger
            showQuickJumper
            showTotal={(total, range) => 
              `${range[0]}-${range[1]} of ${total} items`
            }
            pageSizeOptions={['5', '10', '20', '50']}
          />
        </div>
      )}
    </div>
  );

  // Desktop Table View
  const DesktopTableView = () => (
    <Table
      columns={columns}
      dataSource={dataSource}
      rowKey={rowKey}
      pagination={pagination ? {
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) => 
          `${range[0]}-${range[1]} of ${total} items`,
      } : false}
      loading={loading}
      scroll={{ x: 'max-content' }}
      {...props}
    />
  );

  return (
    <div className="responsive-table-wrapper">
      {isMobile ? <MobileCardView /> : <DesktopTableView />}
    </div>
  );
};

export default ResponsiveTable;
