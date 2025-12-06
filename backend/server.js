const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const { apiLimiter } = require('./middleware/rateLimiter');

// Load .env file from backend directory regardless of where server.js is called from
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

// CORS configuration
// Clean and validate FRONTEND_URL to prevent invalid header characters
const getFrontendUrl = () => {
  const url = process.env.FRONTEND_URL || 'http://localhost:3000';
  // Remove any whitespace, newlines, or invalid characters
  return url.trim().replace(/[\r\n\t]/g, '');
};

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigin = getFrontendUrl();
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin matches allowed origin
    if (origin === allowedOrigin) {
      callback(null, true);
    } else {
      // In development, allow localhost
      if (process.env.NODE_ENV !== 'production') {
        if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
          return callback(null, true);
        }
      }
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply general API rate limiting
app.use('/api', apiLimiter);

// Swagger API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Linkly API Documentation',
}));

// Routes
// API routes (must be before redirect route to avoid conflicts)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/urls', require('./routes/urls'));
app.use('/api/protected', require('./routes/protected'));
app.use('/api/test', require('./routes/test'));

// Public redirect route (must be last to catch short codes)
app.use('/', require('./routes/redirect'));

// Serve static files from React app in production (if frontend is built)
// This is optional - only needed if you want to serve frontend from backend
// For Render + Vercel deployment, this is not needed as Vercel serves the frontend
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../frontend/dist');
  const fs = require('fs');
  if (fs.existsSync(frontendPath)) {
    app.use(express.static(frontendPath));
    
    // Handle React routing, return all requests to React app
    app.get('*', (req, res) => {
      // Don't serve index.html for API routes
      if (req.path.startsWith('/api')) {
        return res.status(404).json({ success: false, message: 'API route not found' });
      }
      res.sendFile(path.join(frontendPath, 'index.html'));
    });
  }
}

// MongoDB Connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/mern-boilerplate';
    
    if (!mongoURI || mongoURI.includes('your-') || mongoURI.includes('username')) {
      console.error('❌ MongoDB URI is not configured properly!');
      console.error('   Please set MONGODB_URI in backend/.env file');
      process.exit(1);
    }

    // For MongoDB Atlas: Add database name if not present
    let connectionURI = mongoURI;
    if (mongoURI.includes('mongodb+srv://') && !mongoURI.includes('?') && !mongoURI.match(/\/[^\/]+\?/)) {
      // Add database name before query parameters
      const dbName = 'mern-boilerplate';
      if (!mongoURI.match(/\/[a-zA-Z]/)) {
        connectionURI = mongoURI.replace('mongodb.net/', `mongodb.net/${dbName}?`);
      }
    }

    // Mongoose 8.x: useNewUrlParser and useUnifiedTopology are no longer needed
    // Add connection timeout for better error handling
    await mongoose.connect(connectionURI, {
      serverSelectionTimeoutMS: 10000, // 10 seconds
    });
    
    console.log('✅ MongoDB Connected successfully');
    console.log(`   Database: ${mongoose.connection.name}`);
    console.log(`   Host: ${mongoose.connection.host}`);
    if (mongoose.connection.port) {
      console.log(`   Port: ${mongoose.connection.port}`);
    }
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('\n📝 Troubleshooting tips:');
    
    // Specific error handling
    if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      console.error('   🔍 DNS Resolution Failed:');
      console.error('      - Check internet connection');
      console.error('      - Verify MongoDB Atlas cluster URL');
    } else if (error.message.includes('authentication failed')) {
      console.error('   🔍 Authentication Failed:');
      console.error('      - Check username/password in connection string');
      console.error('      - Verify database user exists in MongoDB Atlas');
    } else if (error.message.includes('IP') || error.message.includes('whitelist')) {
      console.error('   🔍 IP Address Not Whitelisted:');
      console.error('      1. Go to MongoDB Atlas → Network Access');
      console.error('      2. Click "Add IP Address"');
      console.error('      3. Add your IP or use 0.0.0.0/0 (dev only)');
    } else if (error.message.includes('timeout')) {
      console.error('   🔍 Connection Timeout:');
      console.error('      - Check IP whitelist in MongoDB Atlas');
      console.error('      - Verify cluster is not paused');
      console.error('      - Check firewall settings');
    }
    
    console.error('\n   General checks:');
    console.error('   1. Verify MONGODB_URI in backend/.env file');
    console.error('   2. Ensure database name is in connection string');
    console.error('   3. Check MongoDB Atlas cluster status');
    console.error('   4. Run: node backend/test-mongo-connection.js (for detailed test)\n');
    process.exit(1);
  }
};

// Handle MongoDB connection events
mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB error:', err);
});

connectDB();

// For Render deployment, use PORT from environment (Render sets this automatically)
const PORT = process.env.PORT || 5000;

// Only start server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    if (process.env.NODE_ENV === 'production') {
      console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'Not set'}`);
      console.log(`API Documentation: http://localhost:${PORT}/api-docs`);
    }
  });
}

// Export app for testing
module.exports = app;

