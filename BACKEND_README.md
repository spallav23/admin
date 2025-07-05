# Havre Bakery Backend API

A complete Node.js/Express backend for the Havre Bakery admin panel and main website.

## 🚀 Quick Start

1. **Install dependencies**: `npm install`
2. **Start MongoDB**: Make sure MongoDB is running
3. **Seed database**: `npm run seed`
4. **Start server**: `npm run dev`
5. **API Base URL**: `http://localhost:8080`

## 📡 Key API Endpoints

### Admin Panel APIs
- `POST /api/auth/login` - Admin login
- `GET /api/getProducts` - Get products
- `POST /api/createProduct` - Create product
- `GET /api/dashboard/stats` - Dashboard stats
- `GET /api/orders` - Get orders

### Website APIs
- `GET /website/products` - Public products
- `GET /website/products/featured` - Featured products
- `POST /api/orders` - Create order (from website)

## 🔐 Default Admin Login
- **Username**: `admin`
- **Password**: `admin123`

## 🗄️ Database
- **MongoDB** with sample data
- **Auto-seeding** with products, orders, and admin user
- **Indexes** for performance

## 🔧 Environment Variables
Check `.env` file for configuration:
- `PORT=8080`
- `MONGODB_URI=mongodb://localhost:27017/havre-bakery`
- `JWT_SECRET=havre-bakery-super-secret-key-2024`

## 📁 File Structure
- `src/controllers/` - Business logic
- `src/models/` - Database schemas
- `src/routes/` - API routes
- `src/middleware/` - Auth, upload, error handling
- `uploads/` - File storage

## 🚀 Scripts
- `npm run dev` - Development server with nodemon
- `npm start` - Production server
- `npm run seed` - Seed database with sample data

## 🔒 Security Features
- JWT authentication
- Password hashing
- Rate limiting
- Input validation
- File upload restrictions
- CORS protection

The backend is now ready to serve both your admin panel and main bakery website! 🍞
