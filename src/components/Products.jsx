import React, { useState } from 'react';
import {
  Table,
  Button,
  Space,
  Typography,
  Card,
  Modal,
  Form,
  Input,
  InputNumber,
  Upload,
  message,
  Popconfirm,
  Tag,
  Image,
  Row,
  Col,
  Divider
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  EyeOutlined,
  MinusCircleOutlined,
  CloseOutlined
} from '@ant-design/icons';

const { Title } = Typography;
const { TextArea } = Input;

// Dummy products data
const initialProductsData = [
  {
    id: 1,
    name: 'Chocolate Cake',
    description: 'Rich and moist chocolate cake with chocolate frosting',
    price: 25.99,
    quantity: 15,
    weight: '1.5 kg',
    servings: '8-10 people',
    category: 'Cakes',
    image: 'https://via.placeholder.com/150x150/8B4513/FFFFFF?text=Chocolate+Cake',
    details: [
      { title: 'Ingredients', value: 'Chocolate, Flour, Sugar, Eggs, Butter' },
      { title: 'Allergens', value: 'Contains Gluten, Eggs, Dairy' },
      { title: 'Storage', value: 'Refrigerate for up to 5 days' }
    ]
  },
  {
    id: 2,
    name: 'Vanilla Cupcakes',
    description: 'Light and fluffy vanilla cupcakes with buttercream frosting',
    price: 3.50,
    quantity: 48,
    weight: '80g each',
    servings: '1 person',
    category: 'Cupcakes',
    image: 'https://via.placeholder.com/150x150/FFB6C1/FFFFFF?text=Vanilla+Cupcake',
    details: [
      { title: 'Ingredients', value: 'Vanilla, Flour, Sugar, Eggs, Butter' },
      { title: 'Allergens', value: 'Contains Gluten, Eggs, Dairy' },
      { title: 'Storage', value: 'Store at room temperature for 3 days' }
    ]
  },
  {
    id: 3,
    name: 'Croissants',
    description: 'Buttery, flaky French pastries perfect for breakfast',
    price: 2.25,
    quantity: 24,
    weight: '65g each',
    servings: '1 person',
    category: 'Pastries',
    image: 'https://via.placeholder.com/150x150/DAA520/FFFFFF?text=Croissant',
    details: [
      { title: 'Ingredients', value: 'Flour, Butter, Yeast, Salt, Sugar' },
      { title: 'Allergens', value: 'Contains Gluten, Dairy' },
      { title: 'Storage', value: 'Best consumed fresh, store for 2 days' }
    ]
  },
  {
    id: 4,
    name: 'Wedding Cake',
    description: 'Elegant three-tier wedding cake with custom decorations',
    price: 150.00,
    quantity: 2,
    weight: '5 kg',
    servings: '50+ people',
    category: 'Special Cakes',
    image: 'https://via.placeholder.com/150x150/F0F8FF/000000?text=Wedding+Cake',
    details: [
      { title: 'Ingredients', value: 'Premium flour, Vanilla, Eggs, Butter, Fondant' },
      { title: 'Allergens', value: 'Contains Gluten, Eggs, Dairy' },
      { title: 'Storage', value: 'Refrigerate, consume within 3 days' },
      { title: 'Lead Time', value: '7 days advance order required' }
    ]
  },
  {
    id: 5,
    name: 'Macarons',
    description: 'Delicate French macarons in assorted flavors',
    price: 2.00,
    quantity: 60,
    weight: '20g each',
    servings: '1-2 bites',
    category: 'Pastries',
    image: 'https://via.placeholder.com/150x150/FF69B4/FFFFFF?text=Macaron',
    details: [
      { title: 'Ingredients', value: 'Almond flour, Sugar, Egg whites, Food coloring' },
      { title: 'Allergens', value: 'Contains Nuts, Eggs' },
      { title: 'Storage', value: 'Store in airtight container for 5 days' },
      { title: 'Flavors', value: 'Vanilla, Chocolate, Strawberry, Pistachio' }
    ]
  }
];

const Products = () => {
  const [products, setProducts] = useState(initialProductsData);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const showModal = (product = null) => {
    setEditingProduct(product);
    setIsModalVisible(true);
    if (product) {
      // Set form values including dynamic details
      form.setFieldsValue({
        ...product,
        details: product.details || [{ title: '', value: '' }]
      });

      // Set images if they exist
      if (product.images && product.images.length > 0) {
        const imageFileList = product.images.map((url, index) => ({
          uid: `-${index}`,
          name: `image-${index}.jpg`,
          status: 'done',
          url: url,
        }));
        setFileList(imageFileList);
      } else if (product.image) {
        // Handle legacy single image
        setFileList([{
          uid: '-1',
          name: 'image.jpg',
          status: 'done',
          url: product.image,
        }]);
      } else {
        setFileList([]);
      }
    } else {
      form.resetFields();
      form.setFieldsValue({
        details: [{ title: '', value: '' }]
      });
      setFileList([]);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingProduct(null);
    form.resetFields();
    setFileList([]);
  };

  const handleSubmit = async (values) => {
    try {
      // Process images from file list
      const images = fileList.map(file => {
        if (file.url) return file.url;
        if (file.response && file.response.url) return file.response.url;
        return file.thumbUrl || 'https://via.placeholder.com/150x150/CCCCCC/FFFFFF?text=No+Image';
      });

      // Process details array (filter out empty entries)
      const detailsArray = (values.details || []).filter(detail =>
        detail && detail.title && detail.value &&
        detail.title.trim() !== '' && detail.value.trim() !== ''
      );

      const productData = {
        ...values,
        details: detailsArray,
        images: images.length > 0 ? images : ['https://via.placeholder.com/150x150/CCCCCC/FFFFFF?text=No+Image'],
        image: images[0] || 'https://via.placeholder.com/150x150/CCCCCC/FFFFFF?text=No+Image' // Keep for backward compatibility
      };

      if (editingProduct) {
        // Update existing product
        setProducts(products.map(p =>
          p.id === editingProduct.id
            ? { ...productData, id: editingProduct.id }
            : p
        ));
        message.success('Product updated successfully!');
      } else {
        // Add new product
        const newProduct = {
          ...productData,
          id: Math.max(...products.map(p => p.id)) + 1
        };
        setProducts([...products, newProduct]);
        message.success('Product added successfully!');
      }

      handleCancel();
    } catch (error) {
      message.error('Failed to save product');
    }
  };

  const handleDelete = (id) => {
    setProducts(products.filter(p => p.id !== id));
    message.success('Product deleted successfully!');
  };

  // Image upload handlers
  const handleImageChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handleImagePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    // You can implement a preview modal here if needed
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  // Helper function to convert file to base64
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const columns = [
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      width: 80,
      render: (image, record) => (
        <Image
          width={50}
          height={50}
          src={image}
          alt={record.name}
          style={{ objectFit: 'cover', borderRadius: '4px' }}
        />
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category) => <Tag color="blue">{category}</Tag>,
      filters: [
        { text: 'Cakes', value: 'Cakes' },
        { text: 'Cupcakes', value: 'Cupcakes' },
        { text: 'Pastries', value: 'Pastries' },
        { text: 'Special Cakes', value: 'Special Cakes' },
      ],
      onFilter: (value, record) => record.category === value,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `$${price.toFixed(2)}`,
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: 'Weight',
      dataIndex: 'weight',
      key: 'weight',
    },
    {
      title: 'Servings',
      dataIndex: 'servings',
      key: 'servings',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EyeOutlined />} 
            size="small"
            onClick={() => showModal(record)}
          >
            View
          </Button>
          <Button 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => showModal(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this product?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              danger 
              icon={<DeleteOutlined />} 
              size="small"
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: isMobile ? '16px' : '24px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? '16px' : '0'
      }}>
        <Title level={2} style={{ margin: 0 }}>
          🧁 Products Management
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal()}
          size={isMobile ? 'middle' : 'large'}
          style={{ width: isMobile ? '100%' : 'auto' }}
        >
          Add New Product
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={products}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} products`,
          }}
        />
      </Card>

      {/* Product Form Modal */}
      <Modal
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={isMobile ? '95%' : 800}
        style={{ top: isMobile ? 20 : undefined }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="Product Name"
            rules={[{ required: true, message: 'Please enter product name' }]}
          >
            <Input placeholder="Enter product name" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <TextArea rows={3} placeholder="Enter product description" />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="price"
                label="Price ($)"
                rules={[{ required: true, message: 'Please enter price' }]}
              >
                <InputNumber
                  min={0}
                  step={0.01}
                  placeholder="0.00"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                name="quantity"
                label="Quantity"
                rules={[{ required: true, message: 'Please enter quantity' }]}
              >
                <InputNumber
                  min={0}
                  placeholder="0"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="weight"
                label="Weight"
                rules={[{ required: true, message: 'Please enter weight' }]}
              >
                <Input placeholder="e.g., 1.5 kg, 80g each" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                name="servings"
                label="Servings"
                rules={[{ required: true, message: 'Please enter servings' }]}
              >
                <Input placeholder="e.g., 8-10 people, 1 person" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: 'Please enter category' }]}
          >
            <Input placeholder="e.g., Cakes, Pastries, Cupcakes" />
          </Form.Item>

          <Form.Item
            label="Product Images"
            help="Upload multiple images for your product (JPG/PNG, max 2MB each)"
          >
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={handleImageChange}
              onPreview={handleImagePreview}
              beforeUpload={beforeUpload}
              multiple
              maxCount={5}
            >
              {fileList.length >= 5 ? null : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <Divider>Product Details</Divider>

          <Form.List name="details">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Row key={key} gutter={16} align="middle">
                    <Col xs={24} sm={10}>
                      <Form.Item
                        {...restField}
                        name={[name, 'title']}
                        rules={[{ required: true, message: 'Please enter title' }]}
                      >
                        <Input placeholder="e.g., Ingredients, Allergens, Storage" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        {...restField}
                        name={[name, 'value']}
                        rules={[{ required: true, message: 'Please enter value' }]}
                      >
                        <Input placeholder="e.g., Flour, Sugar, Eggs" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={2}>
                      <Button
                        type="text"
                        danger
                        icon={<MinusCircleOutlined />}
                        onClick={() => remove(name)}
                        style={{ width: '100%' }}
                      />
                    </Col>
                  </Row>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Product Detail
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                {editingProduct ? 'Update Product' : 'Add Product'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Products;
