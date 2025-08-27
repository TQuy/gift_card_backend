# Gift Card Issuing API

A RESTful API built with Express.js for managing gift card brands and issuing gift cards.

## Features

- List all available brands
- View individual brand details
- Issue gift cards for specific brands
- View issued cards per brand
- Generate unique activation codes
- JSON API responses

## API Endpoints

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

2. Start the development server:
```bash
npm run dev
```

3. Start the production server:
```bash
npm start
```

The API will be available at `http://localhost:3000`

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
- UUID for unique identifiers
- CORS for cross-origin requests
- Helmet for security headers
- Morgan for logging
