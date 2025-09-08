# Gift Card Issuing API

A RESTful API built with Express.js for managing gift card brands, issuing gift cards, and user authentication.

## Features

- User authentication (register, login, logout)
- JWT-based authentication with HTTP-only cookies
- Role-based access control (Admin/User)
- List all available brands
- View individual brand details
- Issue gift cards for specific brands
- View issued cards per brand
- Generate unique activation codes
- JSON API responses

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user information (protected)

### Brands

- `GET /api/brands` - List all brands
- `GET /api/brands/:id` - Get specific brand details
- `POST /api/brands/:id/issues` - Issue a gift card for a brand
- `GET /api/brands/:id/issues` - List issued cards for a brand

### Health Check

- `GET /api/health` - API health status

## Installation

1. Install dependencies:
```bash
npm install
```

2. Copy environment configuration:
```bash
cp .env.example .env
```

3. Configure environment variables in `.env`:
   - Set `JWT_SECRET` to a secure random string
   - Set `COOKIE_SECRET` to a secure random string
   - Add your frontend URLs to `FRONTEND_URLS` for production

4. Start the development server:
```bash
npm run dev
```

5. Start the production server:
```bash
npm start
```

The API will be available at `http://localhost:3000`

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
