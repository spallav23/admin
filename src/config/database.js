const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);
    
    // Create indexes for better performance
    await createIndexes();
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

const createIndexes = async () => {
  try {
    // Product indexes
    await mongoose.connection.db.collection('products').createIndex({ name: 'text', description: 'text' });
    await mongoose.connection.db.collection('products').createIndex({ category: 1 });
    await mongoose.connection.db.collection('products').createIndex({ price: 1 });
    await mongoose.connection.db.collection('products').createIndex({ stock: 1 });
    await mongoose.connection.db.collection('products').createIndex({ isActive: 1 });
    
    // Order indexes
    await mongoose.connection.db.collection('orders').createIndex({ orderNumber: 1 }, { unique: true });
    await mongoose.connection.db.collection('orders').createIndex({ status: 1 });
    await mongoose.connection.db.collection('orders').createIndex({ createdAt: -1 });
    await mongoose.connection.db.collection('orders').createIndex({ customerEmail: 1 });
    
    // User indexes
    await mongoose.connection.db.collection('users').createIndex({ email: 1 }, { unique: true });
    await mongoose.connection.db.collection('users').createIndex({ username: 1 }, { unique: true });
    
    console.log('📊 Database indexes created successfully');
  } catch (error) {
    console.log('⚠️  Index creation warning:', error.message);
  }
};

module.exports = connectDB;
