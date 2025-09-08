# Gift Card Issuing API

A RESTful API built with Express.js for managing gift card brands, issuing gift cards, and user authentication with JWT-based authentication and role-based access control.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Populate Data](#populate-data)
- [Authentication](#authentication)
- [API Endpoints](#api-endpoints)
- [CORS Configuration](#cors-configuration)
- [Technologies Used](#technologies-used)
- [Environment Variables](#environment-variables)

## Features

- 🔐 User authentication (register, login, logout)
- 🍪 JWT-based authentication with HTTP-only cookies
- 👥 Role-based access control (Admin/User)
- 🏪 List all available brands with pagination
- 🔍 View individual brand details
- 🎁 Issue gift cards for specific brands
- 📊 View issued cards per brand with analytics
- 🔑 Generate unique activation codes
- 🌐 Secure CORS configuration for cross-origin requests
- 📖 Comprehensive API documentation with Swagger
- ✅ Full test coverage with Jest

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Setup Steps

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd gift_card/back-end
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   NODE_ENV=development
   PORT=3000
   JWT_SECRET=your-super-secure-jwt-secret-here
   COOKIE_SECRET=your-super-secure-cookie-secret-here
   FRONTEND_URLS=http://localhost:3000,http://localhost:5173
   ```

4. **Start the server:**
   ```bash
   # Development mode (with hot reload)
   npm run dev
   
   # Production mode
   npm start
   ```

🚀 **Server will be running at:** `http://localhost:8000`

**Note:** The database and tables are automatically created and synchronized when the server starts for the first time.

## API Documentation

### 📖 Interactive Swagger Documentation

**Access the complete API documentation at:** [`http://localhost:8000/api-docs`](http://localhost:8000/api-docs)

The Swagger UI provides:
- ✨ **Complete endpoint specifications**
- 📋 **Request/response schemas**
- 🔒 **Authentication requirements**
- 💡 **Example requests and responses**
- 🧪 **Try-it-out functionality**
- 🔄 **Real-time testing interface**

### Quick API Overview

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/health` | Health check | ❌ |
| `POST` | `/api/auth/register` | Register user | ❌ |
| `POST` | `/api/auth/login` | Login user | ❌ |
| `POST` | `/api/auth/logout` | Logout user | ❌ |
| `GET` | `/api/auth/me` | Get current user | ✅ |
| `GET` | `/api/brands` | List brands | ✅ |
| `GET` | `/api/brands/:id` | Get brand details | ✅ |
| `POST` | `/api/brands/:id/issues` | Issue gift card | ✅ |
| `GET` | `/api/brands/:id/issues` | List issued cards | ✅ |

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Generate test coverage report (not available in current setup)
# npm run test:coverage

# Run specific test file
npm test -- __tests__/auth.test.ts

# Run tests for specific pattern
npm test -- --testNamePattern="should login"
```

### Test Coverage

Our comprehensive test suite includes:

- ✅ **Unit Tests**: Service layer logic
- ✅ **Integration Tests**: API endpoint functionality  
- ✅ **Authentication Tests**: Login/logout flows
- ✅ **Authorization Tests**: Role-based access control
- ✅ **Validation Tests**: Input validation and error handling
- ✅ **Database Tests**: Model relationships and operations

**Current Coverage:** 57 tests passing, 1 failing (58 total tests) covering all major functionality

### Test Structure
```
__tests__/
├── auth.test.ts              # Authentication endpoints
├── brands.test.ts            # Brand and gift card endpoints
└── services/
    ├── authService.test.ts   # Auth business logic
    └── brandsService.test.ts # Brand business logic
```

## Populate Data

### Seeding the Database

```bash
# Populate database with sample data
npm run db:populate

# Clear and repopulate database (clean slate)
npm run db:populate:clear

# Seed only brands
npm run db:seed:brands

# Seed only users
npm run db:seed:users
```
**Note:** After changing the tables' structure, you may need to remove the SQLite database before populating the data.

### Sample Data Included

After running `db:populate`, your database will have:

**🏪 Brands:**
- Grab (Southeast Asian super app)
- Amazon (Global e-commerce)
- Esprit (Fashion and lifestyle)  
- Subway (Restaurant chain)
- Lazada (Online shopping platform)
- Kaspersky (Cybersecurity)
- Netflix (Streaming service)
- Spotify (Music streaming)
- Plus 2 additional brand variants

**👥 User Accounts:**
- **Admin Account**: `admin@example.com` / password: `1`
- **User Roles**: Admin and User roles pre-configured

**🎁 Sample Gift Cards:**
- Test gift cards for each brand
- Various amounts and configurations
- Different delivery types and statuses

### Custom Data Setup

You can also create your own data by:
1. Using the API endpoints after authentication
2. Modifying the seed files in `utils/seedData/`
3. Running custom SQL against the SQLite database at `./data/gift_cards.sqlite`

## Authentication

### 🔐 JWT Cookie-Based Authentication

This API uses **JWT tokens stored in HTTP-only cookies** for secure authentication.

#### How It Works

1. **Login**: Send credentials to `/api/auth/login`
2. **Receive Cookie**: Server sets `authToken` HTTP-only cookie
3. **Automatic**: Browser includes cookie in subsequent requests
4. **Validation**: Server validates JWT on each protected endpoint
5. **Logout**: Cookie is cleared on `/api/auth/logout`

#### Security Features

- ✅ **HTTP-only cookies** prevent XSS attacks
- ✅ **SameSite=Strict** prevents CSRF attacks  
- ✅ **Secure flag** in production (HTTPS only)
- ✅ **Role-based authorization** (Admin/User)
- ✅ **Automatic token expiration**

#### Usage in API Clients

**Frontend JavaScript:**
```javascript
// Login (sets cookie automatically)
await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include', // Important: include cookies
  body: JSON.stringify({ email, password })
});

// Use protected endpoints
await fetch('/api/brands', {
  credentials: 'include' // Always include for auth
});
```

**Testing with curl:**
```bash
# Login and save cookies
curl -c cookies.txt -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"1"}'

# Use protected endpoint with cookies
curl -b cookies.txt http://localhost:8000/api/brands
```

## API Endpoints

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secure123",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Login User  
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com", 
  "password": "secure123"
}
```

#### Get Current User
```http
GET /api/auth/me
Cookie: authToken=<jwt-token>
```

### Brand Endpoints

#### List All Brands
```http
GET /api/brands?page=1&limit=10
Cookie: authToken=<jwt-token>
```

#### Get Brand Details
```http
GET /api/brands/:id
Cookie: authToken=<jwt-token>
```

#### Issue Gift Card
```http
POST /api/brands/:id/issues
Cookie: authToken=<jwt-token>
Content-Type: application/json

{
  "amount": 50.00,
  "quantity": 1,
  "deliveryType": "email",
  "recipientEmail": "recipient@example.com"
}
```

#### List Issued Cards
```http
GET /api/brands/:id/issues?page=1&limit=10
Cookie: authToken=<jwt-token>
```

## CORS Configuration

### Production CORS Setup

This API is configured for secure cross-origin requests with credentials:

```javascript
// Allowed origins (configure in .env)
const allowedOrigins = process.env.FRONTEND_URLS?.split(',') || [
  'http://localhost:8000',
  'https://your-production-domain.com'
];

// CORS configuration
app.use(cors({
  origin: allowedOrigins,
  credentials: true,  // Allow cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### Frontend Configuration

**Important**: Always set `credentials: 'include'` in fetch requests:

```javascript
// ✅ Correct - includes authentication cookies
fetch('/api/brands', { 
  credentials: 'include' 
});

// ❌ Incorrect - authentication will fail
fetch('/api/brands');
```

## Technologies Used

### Core Stack
- **Runtime**: Node.js (v16+)
- **Framework**: Express.js
- **Database**: SQLite with Sequelize ORM
- **Language**: TypeScript
- **Authentication**: JWT (JSON Web Tokens)

### Security & Middleware
- **CORS**: Cross-origin resource sharing
- **Cookie Parser**: HTTP-only cookie handling
- **Bcrypt**: Password hashing
- **Helmet**: Security headers

### Documentation & Testing
- **API Docs**: Swagger/OpenAPI 3.0
- **Testing**: Jest framework
- **Code Quality**: ESLint, Prettier

### Database Models
- **User**: Authentication and profile data
- **Role**: Role-based access control
- **Brand**: Gift card brand information  
- **GiftCard**: Issued gift card records

## Environment Variables

### Required Configuration

Create a `.env` file in the project root:

```env
# Application
NODE_ENV=development
PORT=8000

# Security (IMPORTANT: Use strong, unique values in production)
JWT_SECRET=your-super-secure-jwt-secret-minimum-32-characters
COOKIE_SECRET=your-super-secure-cookie-secret-minimum-32-characters

# CORS - Frontend URLs (comma-separated)
FRONTEND_URLS=http://localhost:3000,http://localhost:5173,https://your-domain.com

# Database (SQLite - automatically created)
DB_PATH=./data/gift_cards.sqlite

# Logging
LOG_LEVEL=info
```

### Environment Variable Descriptions

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NODE_ENV` | Yes | Application environment | `development`, `production` |
| `PORT` | No | Server port (default: 8000) | `8000` |
| `JWT_SECRET` | Yes | JWT signing secret (32+ chars) | `super-secret-jwt-key-32-chars-min` |
| `COOKIE_SECRET` | Yes | Cookie signing secret (32+ chars) | `super-secret-cookie-key-32-chars` |
| `FRONTEND_URLS` | Yes | Allowed CORS origins | `http://localhost:3000,https://app.com` |
| `DB_PATH` | No | SQLite database path | `./data/gift_cards.sqlite` |

### Security Notes

⚠️ **Important Security Requirements:**

1. **Use strong secrets** (minimum 32 characters)
2. **Never commit `.env`** to version control
3. **Rotate secrets regularly** in production
4. **Use HTTPS** in production environments
5. **Restrict FRONTEND_URLS** to known domains only

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env
# Edit .env with your configuration

# 3. Populate sample data
npm run db:populate

# 4. Run tests
npm test

# 5. Start development server
npm run dev

# 6. View API documentation
open http://localhost:8000/api-docs
```

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

---

**Built with ❤️ using Node.js, Express, and TypeScript**

## Authentication

### Register User

To register a new user, send a POST request to `/api/auth/register`:

```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123",
  "role": 2
}
```

### Login

To login, send a POST request to `/api/auth/login`:

```json
{
  "username": "testuser",
  "password": "password123"
}
```

Authentication uses JWT tokens stored in HTTP-only cookies for security.

## CORS Configuration

The API is configured to support cookie-based authentication with proper CORS settings:

- **Credentials Enabled**: `Access-Control-Allow-Credentials: true`
- **Explicit Origins**: No wildcard (*) usage for security
- **Development Origins**: Supports common development servers (localhost:3000, localhost:5173, etc.)
- **Production Origins**: Configure via `FRONTEND_URLS` environment variable

### Frontend Integration

When making requests from your frontend application, ensure you:

1. **Include credentials in requests:**
   ```javascript
   // Using fetch
   fetch('http://localhost:8000/api/brands', {
     credentials: 'include'
   })
   
   // Using axios
   axios.defaults.withCredentials = true;
   ```

2. **Set your frontend URL in allowed origins** (for production)

## Issue Gift Card

To issue a gift card, send a POST request to `/api/brands/:id/issues` with the following payload:

```json
{
  "amount": 50.00,
  "recipientEmail": "recipient@example.com",
  "message": "Happy Birthday!",
  "pin": "1234"
}
```

## Response Format

All responses follow this format:

```json
{
  "status": "success",
  "data": { ... },
  "total": 5
}
```

## Available Brands

The API comes pre-seeded with these brands:
- Lazada
- Grab  
- Amazon
- Subway
- Esprit

## Technologies Used

- Node.js
- Express.js
- TypeScript
- Sequelize ORM
- SQLite Database
- JWT Authentication
- bcryptjs for password hashing
- UUID for unique identifiers
- CORS for cross-origin requests
- Helmet for security headers
- Morgan for logging

## API Documentation

Interactive API documentation is available via Swagger UI at `http://localhost:3000/api-docs` when the server is running.
