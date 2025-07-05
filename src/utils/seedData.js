const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

const seedUsers = async () => {
  try {
    // Check if admin user already exists
    const existingAdmin = await User.findOne({ username: 'admin' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Create admin user
    const adminUser = await User.create({
      username: process.env.ADMIN_USERNAME || 'admin',
      email: process.env.ADMIN_EMAIL || 'admin@havrebakery.com',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin'
    });

    console.log('✅ Admin user created:', adminUser.username);
  } catch (error) {
    console.error('❌ Error seeding users:', error.message);
  }
};

const seedProducts = async () => {
  try {
    const existingProducts = await Product.countDocuments();
    if (existingProducts > 0) {
      console.log('Products already exist');
      return;
    }

    const sampleProducts = [
      {
        name: 'Classic Chocolate Cake',
        description: 'Rich, moist chocolate cake with chocolate ganache frosting. Perfect for celebrations.',
        price: 25.99,
        category: 'Cakes',
        images: [
          { url: '/uploads/products/chocolate-cake.jpg', alt: 'Classic Chocolate Cake', isPrimary: true }
        ],
        ingredients: ['Flour', 'Cocoa Powder', 'Sugar', 'Eggs', 'Butter', 'Vanilla'],
        allergens: ['Gluten', 'Dairy', 'Eggs'],
        stock: 15,
        isFeatured: true,
        preparationTime: 60,
        tags: ['chocolate', 'celebration', 'popular']
      },
      {
        name: 'Fresh Croissants',
        description: 'Buttery, flaky croissants baked fresh daily. Perfect for breakfast.',
        price: 3.50,
        category: 'Pastries',
        images: [
          { url: '/uploads/products/croissants.jpg', alt: 'Fresh Croissants', isPrimary: true }
        ],
        ingredients: ['Flour', 'Butter', 'Yeast', 'Salt', 'Sugar'],
        allergens: ['Gluten', 'Dairy'],
        stock: 50,
        isFeatured: true,
        preparationTime: 30,
        tags: ['breakfast', 'buttery', 'fresh']
      },
      {
        name: 'Artisan Sourdough Bread',
        description: 'Traditional sourdough bread with a crispy crust and tangy flavor.',
        price: 6.99,
        category: 'Bread',
        images: [
          { url: '/uploads/products/sourdough.jpg', alt: 'Artisan Sourdough Bread', isPrimary: true }
        ],
        ingredients: ['Sourdough Starter', 'Flour', 'Water', 'Salt'],
        allergens: ['Gluten'],
        stock: 25,
        isFeatured: false,
        preparationTime: 45,
        tags: ['artisan', 'sourdough', 'traditional']
      },
      {
        name: 'Chocolate Chip Cookies',
        description: 'Soft and chewy chocolate chip cookies made with premium chocolate.',
        price: 12.99,
        category: 'Cookies',
        images: [
          { url: '/uploads/products/cookies.jpg', alt: 'Chocolate Chip Cookies', isPrimary: true }
        ],
        ingredients: ['Flour', 'Chocolate Chips', 'Butter', 'Sugar', 'Eggs'],
        allergens: ['Gluten', 'Dairy', 'Eggs'],
        stock: 40,
        isFeatured: true,
        preparationTime: 25,
        tags: ['cookies', 'chocolate', 'sweet']
      },
      {
        name: 'Vanilla Cupcakes',
        description: 'Light and fluffy vanilla cupcakes with buttercream frosting.',
        price: 18.99,
        category: 'Cakes',
        images: [
          { url: '/uploads/products/cupcakes.jpg', alt: 'Vanilla Cupcakes', isPrimary: true }
        ],
        ingredients: ['Flour', 'Sugar', 'Eggs', 'Butter', 'Vanilla', 'Baking Powder'],
        allergens: ['Gluten', 'Dairy', 'Eggs'],
        stock: 30,
        isFeatured: false,
        preparationTime: 40,
        tags: ['cupcakes', 'vanilla', 'party']
      },
      {
        name: 'Danish Pastries',
        description: 'Assorted Danish pastries with fruit and cream cheese fillings.',
        price: 4.25,
        category: 'Pastries',
        images: [
          { url: '/uploads/products/danish.jpg', alt: 'Danish Pastries', isPrimary: true }
        ],
        ingredients: ['Puff Pastry', 'Cream Cheese', 'Fruit', 'Sugar'],
        allergens: ['Gluten', 'Dairy', 'Eggs'],
        stock: 35,
        isFeatured: false,
        preparationTime: 35,
        tags: ['danish', 'fruit', 'cream']
      },
      {
        name: 'Espresso Coffee',
        description: 'Rich and bold espresso coffee, perfect with our pastries.',
        price: 2.99,
        category: 'Beverages',
        images: [
          { url: '/uploads/products/espresso.jpg', alt: 'Espresso Coffee', isPrimary: true }
        ],
        ingredients: ['Coffee Beans'],
        allergens: [],
        stock: 100,
        isFeatured: false,
        preparationTime: 5,
        tags: ['coffee', 'espresso', 'hot']
      },
      {
        name: 'Seasonal Fruit Tart',
        description: 'Beautiful tart filled with seasonal fresh fruits and pastry cream.',
        price: 22.99,
        category: 'Seasonal',
        images: [
          { url: '/uploads/products/fruit-tart.jpg', alt: 'Seasonal Fruit Tart', isPrimary: true }
        ],
        ingredients: ['Pastry', 'Pastry Cream', 'Fresh Fruits', 'Glaze'],
        allergens: ['Gluten', 'Dairy', 'Eggs'],
        stock: 12,
        isFeatured: true,
        preparationTime: 50,
        tags: ['seasonal', 'fruit', 'elegant']
      }
    ];

    await Product.insertMany(sampleProducts);
    console.log('✅ Sample products created');
  } catch (error) {
    console.error('❌ Error seeding products:', error.message);
  }
};

const seedOrders = async () => {
  try {
    const existingOrders = await Order.countDocuments();
    if (existingOrders > 0) {
      console.log('Orders already exist');
      return;
    }

    const products = await Product.find().limit(5);
    if (products.length === 0) {
      console.log('No products found for seeding orders');
      return;
    }

    const sampleOrders = [
      {
        customer: {
          name: 'John Smith',
          email: 'john@example.com',
          phone: '+1-555-0123'
        },
        items: [
          {
            product: products[0]._id,
            name: products[0].name,
            price: products[0].price,
            quantity: 1,
            subtotal: products[0].price
          }
        ],
        subtotal: products[0].price,
        tax: products[0].price * 0.08,
        deliveryFee: 5.00,
        total: products[0].price + (products[0].price * 0.08) + 5.00,
        orderType: 'delivery',
        paymentMethod: 'card',
        status: 'delivered',
        paymentStatus: 'paid',
        deliveryAddress: {
          street: '123 Main St',
          city: 'Anytown',
          state: 'CA',
          zipCode: '12345',
          country: 'USA'
        }
      },
      {
        customer: {
          name: 'Sarah Johnson',
          email: 'sarah@example.com',
          phone: '+1-555-0456'
        },
        items: [
          {
            product: products[1]._id,
            name: products[1].name,
            price: products[1].price,
            quantity: 6,
            subtotal: products[1].price * 6
          }
        ],
        subtotal: products[1].price * 6,
        tax: (products[1].price * 6) * 0.08,
        deliveryFee: 0,
        total: (products[1].price * 6) + ((products[1].price * 6) * 0.08),
        orderType: 'pickup',
        paymentMethod: 'cash',
        status: 'ready',
        paymentStatus: 'paid'
      }
    ];

    await Order.insertMany(sampleOrders);
    console.log('✅ Sample orders created');
  } catch (error) {
    console.error('❌ Error seeding orders:', error.message);
  }
};

const seedDatabase = async () => {
  console.log('🌱 Starting database seeding...');
  
  await seedUsers();
  await seedProducts();
  await seedOrders();
  
  console.log('🎉 Database seeding completed!');
};

module.exports = {
  seedDatabase,
  seedUsers,
  seedProducts,
  seedOrders
};
