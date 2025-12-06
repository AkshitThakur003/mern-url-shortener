# Linkly - URL Shortener

[![Use this template](https://img.shields.io/badge/Use%20this%20template-2ea44f?style=for-the-badge&logo=github)](https://github.com/new?template_name=mern-boilerplate&template_owner=AkshitThakur003)

A production-ready MERN stack URL shortener with JWT authentication, built with MongoDB, Express, React, and Node.js. Features Redux Toolkit, Tailwind CSS, shadcn/ui components, Framer Motion animations, dark mode support, and a complete authentication system with refresh tokens.

Perfect for learning full-stack development with modern technologies and best practices.

## ✨ Features

### 🔐 Authentication
- **JWT Authentication** with access and refresh tokens
- Secure password hashing with bcryptjs
- Automatic token refresh via axios interceptors
- Protected routes on both frontend and backend
- Signup, Login, Logout, and Profile management
- **Rate limiting** to prevent brute force attacks

### 🎨 Frontend
- **React 18** with Vite for fast development
- **Redux Toolkit** for state management
- **Tailwind CSS** with dark mode support
- **shadcn/ui** components for modern UI
- **Framer Motion** for smooth animations
- **Lucide React** icons
- Beautiful landing page with bento grid layout
- Responsive Navbar and Sidebar with mobile support
- Toast notifications (react-hot-toast)
- Loading states and protected route wrappers
- Fully responsive design

### ⚙️ Backend
- **Express.js** REST API
- **MongoDB** with Mongoose ODM
- User model with password hashing
- Protected API middleware
- CORS enabled
- Input validation with express-validator
- **API Rate Limiting** to prevent abuse
- **Swagger/OpenAPI** documentation

### 🔗 URL Shortening Features
- Create short URLs with custom codes
- Bulk URL creation (up to 50 at once)
- QR code generation for short URLs
- Link preview/metadata extraction
- URL expiration dates
- Enable/disable URLs
- Detailed analytics (clicks, location, device, browser)
- Weekly analytics charts
- Top URLs tracking

### 🧪 Testing
- **Jest** for backend unit and integration tests
- **Vitest** for frontend component tests
- **Playwright** for E2E testing
- Test coverage reporting

### 📚 Documentation
- **Swagger/OpenAPI** API documentation at `/api-docs`
- Comprehensive code comments
- Detailed README

## 🚀 Quick Start

### Installation

1. **Install dependencies:**
   ```bash
   npm run install-all
   ```

2. **Set up environment variables**

   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/linkly
   JWT_SECRET=your-super-secret-jwt-key-change-this
   JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this
   JWT_EXPIRE=7d
   JWT_REFRESH_EXPIRE=30d
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

   Create a `.env` file in the `frontend` directory (optional for development):
   ```env
   VITE_API_URL=http://localhost:5000
   ```

3. **Start MongoDB**

   Make sure MongoDB is running locally or update `MONGODB_URI` with your MongoDB Atlas connection string.

4. **Run the application:**
   ```bash
   npm run dev
   ```

   This starts both servers concurrently with color-coded output:
   - 🔵 **BACKEND** - http://localhost:5000
   - 🟢 **FRONTEND** - http://localhost:3000
   - 📚 **API DOCS** - http://localhost:5000/api-docs

   Or run them separately:
   ```bash
   # Terminal 1 - Backend
   npm run server
   
   # Terminal 2 - Frontend
   npm run client
   ```

## 📁 Project Structure

```
├── backend/
│   ├── config/
│   │   └── swagger.js          # Swagger API documentation config
│   ├── middleware/
│   │   ├── auth.js             # Protected route middleware
│   │   └── rateLimiter.js      # Rate limiting middleware
│   ├── models/
│   │   ├── User.js             # User mongoose model
│   │   └── Url.js               # URL mongoose model
│   ├── routes/
│   │   ├── auth.js              # Auth routes (signup, login, refresh)
│   │   ├── urls.js              # URL routes (CRUD, bulk, QR, preview)
│   │   ├── protected.js        # Protected routes example
│   │   └── redirect.js          # Public redirect route
│   ├── tests/
│   │   ├── setup.js             # Jest test setup
│   │   └── __tests__/
│   │       ├── unit/            # Unit tests
│   │       └── integration/      # Integration tests
│   ├── utils/
│   │   ├── generateToken.js     # JWT token generation
│   │   ├── generateShortCode.js # Short code generation
│   │   ├── qrCodeGenerator.js   # QR code generation
│   │   ├── linkPreview.js       # Link metadata extraction
│   │   └── errorHandler.js      # Error handling utilities
│   ├── server.js                # Express server entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable components
│   │   │   ├── ui/              # shadcn/ui components
│   │   │   ├── DarkModeToggle.jsx
│   │   │   ├── Layout.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── UrlForm.jsx
│   │   │   ├── UrlTable.jsx
│   │   │   ├── StatsCards.jsx
│   │   │   ├── TopUrls.jsx
│   │   │   └── WeeklyChart.jsx
│   │   ├── pages/               # Page components
│   │   │   ├── Landing.jsx      # Landing page
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Signup.jsx
│   │   ├── tests/               # Frontend tests
│   │   ├── redux/               # Redux store and slices
│   │   ├── utils/
│   │   │   ├── axios.js         # Axios instance with interceptors
│   │   │   └── config.js
│   │   ├── lib/
│   │   │   └── utils.js         # Utility functions
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   └── package.json
├── e2e/                         # E2E tests (Playwright)
├── .eslintrc.json               # ESLint configuration
├── .prettierrc                  # Prettier configuration
└── package.json                 # Root package.json
```

## 🔑 API Endpoints

### Authentication Routes (`/api/auth`)

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user (Protected)
- `POST /api/auth/logout` - Logout user (Protected)

### URL Routes (`/api/urls`)

- `POST /api/urls` - Create a short URL (Protected)
  - Optional: `generateQR: true` - Generate QR code
  - Optional: `fetchPreview: true` - Fetch link preview
- `POST /api/urls/bulk` - Create multiple URLs at once (Protected, max 50)
- `GET /api/urls` - Get all URLs for user (Protected)
- `GET /api/urls/stats` - Get aggregated statistics (Protected)
- `GET /api/urls/:id` - Get single URL details (Protected)
- `GET /api/urls/:id/qr` - Get QR code for URL (Protected)
- `POST /api/urls/preview` - Get link preview/metadata (Protected)
- `PATCH /api/urls/:id` - Update URL (enable/disable) (Protected)
- `DELETE /api/urls/:id` - Delete URL (Protected)

### Public Routes

- `GET /:shortCode` - Redirect to original URL

All protected routes require a Bearer token:
```
Authorization: Bearer <your-access-token>
```

**API Documentation:** Visit `http://localhost:5000/api-docs` for interactive Swagger documentation.

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration
```

### Frontend Tests

```bash
cd frontend

# Run tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

### E2E Tests

```bash
# From root directory
npx playwright test

# Run with UI
npx playwright test --ui

# Run specific test
npx playwright test e2e/landing.spec.js
```

## 📝 Available Scripts

### Root Level
- `npm run dev` - Run both backend and frontend concurrently
- `npm run server` - Run backend only
- `npm run client` - Run frontend only
- `npm run install-all` - Install dependencies for all projects

### Backend (`backend/`)
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run all tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:unit` - Run unit tests only
- `npm run test:integration` - Run integration tests only

### Frontend (`frontend/`)
- `npm start` / `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage

## 🎯 How It Works

### Authentication Flow

1. User signs up or logs in → receives access token and refresh token
2. Tokens are stored in localStorage
3. Access token is included in Authorization header for protected routes
4. When access token expires, axios interceptor automatically refreshes it
5. If refresh fails, user is logged out and redirected to login

### URL Shortening Flow

1. User creates a short URL → system generates unique short code
2. Short code is stored in database with original URL
3. When someone visits `/:shortCode`, system redirects to original URL
4. Analytics are tracked (clicks, IP, device, browser, location)
5. User can view analytics in dashboard

### Rate Limiting

- **General API**: 100 requests per 15 minutes per IP
- **Authentication**: 5 requests per 15 minutes per IP (prevents brute force)
- **URL Creation**: 10 requests per minute per IP (prevents spam)

## 🛠️ Advanced Features

### QR Code Generation

Generate QR codes for your short URLs:

```javascript
// When creating URL
POST /api/urls
{
  "originalUrl": "https://example.com",
  "generateQR": true
}

// Or get QR code for existing URL
GET /api/urls/:id/qr
```

### Bulk URL Creation

Create multiple URLs at once:

```javascript
POST /api/urls/bulk
{
  "urls": [
    { "originalUrl": "https://example.com/1" },
    { "originalUrl": "https://example.com/2", "shortCode": "custom" },
    { "originalUrl": "https://example.com/3", "expiresAt": "2024-12-31T23:59:59Z" }
  ]
}
```

### Link Preview

Get metadata/preview for any URL:

```javascript
POST /api/urls/preview
{
  "url": "https://example.com"
}

// Returns: title, description, image, siteName
```

## 🧰 Technologies

**Backend:**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- express-validator
- express-rate-limit
- qrcode
- swagger-jsdoc
- swagger-ui-express
- Jest (testing)
- Supertest (testing)

**Frontend:**
- React 18
- Vite
- Redux Toolkit
- React Router DOM
- Axios
- Tailwind CSS
- shadcn/ui
- Framer Motion
- Lucide React
- react-hot-toast
- recharts
- Vitest (testing)
- Playwright (E2E testing)

## 📄 License

ISC

## 🤝 Contributing

Found a bug or want to add a feature? Feel free to open an issue or submit a pull request!

## 🚀 Deployment

This project is configured for deployment on **Render** (Backend) and **Vercel** (Frontend).

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy:

1. **Backend (Render)**:
   - Connect GitHub repo
   - Set root directory: `backend`
   - Add environment variables (see DEPLOYMENT.md)
   - Deploy!

2. **Frontend (Vercel)**:
   - Import GitHub repo
   - Set root directory: `frontend`
   - Add `VITE_API_URL` environment variable
   - Deploy!

---

**Ready to build?** Start shortening your links with Linkly! 🚀
