const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Gift Card API",
      version: "1.0.0",
      description:
        "A REST API for managing gift card brands and issuing gift cards",
      contact: {
        name: "API Support",
        email: "support@example.com",
      },
    },
    servers: [
      {
        url: "http://localhost:8000",
        description: "Development server",
      },
      {
        url: "https://your-production-domain.com",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description:
            "JWT token for authentication. Include 'Bearer ' prefix with your token.",
        },
      },
      schemas: {
        Brand: {
          type: "object",
          required: ["id", "name", "isActive"],
          properties: {
            id: {
              type: "integer",
              description: "Brand ID",
              example: 1,
            },
            name: {
              type: "string",
              description: "Brand name",
              example: "Lazada",
            },
            description: {
              type: "string",
              description: "Brand description",
              example: "Online shopping platform",
            },
            logo: {
              type: "string",
              description: "Brand logo filename",
              example: "lazada-logo.png",
            },
            isActive: {
              type: "boolean",
              description: "Whether the brand is active",
              example: true,
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Brand creation timestamp",
            },
          },
        },
        GiftCard: {
          type: "object",
          required: [
            "id",
            "brandName",
            "amount",
            "activationCode",
            "recipientEmail",
            "recipientPhone",
            "deliveryType",
            "deliveryTime",
          ],
          properties: {
            id: {
              type: "string",
              format: "uuid",
              description: "Gift card ID",
              example: "123e4567-e89b-12d3-a456-426614174000",
            },
            brandName: {
              type: "string",
              description: "Brand name",
              example: "Lazada",
            },
            amount: {
              type: "number",
              format: "decimal",
              description: "Gift card amount",
              example: 100.0,
            },
            activationCode: {
              type: "string",
              description: "Cryptographically secure activation code",
              example: "B26A4D537827C0EFAD1D7E05A64C15CF",
            },
            senderName: {
              type: "string",
              description: "Name of the sender (required for send_as_gift)",
              example: "John Doe",
            },
            recipientName: {
              type: "string",
              description: "Name of the recipient (required for send_as_gift)",
              example: "Jane Smith",
            },
            recipientEmail: {
              type: "string",
              format: "email",
              description: "Recipient email address",
              example: "jane@example.com",
            },
            recipientPhone: {
              type: "string",
              description: "Recipient phone number",
              example: "+6591234567",
            },
            message: {
              type: "string",
              description: "Optional message",
              example: "Happy Birthday!",
            },
            deliveryType: {
              type: "string",
              enum: ["personal", "send_as_gift"],
              description: "Delivery type",
              example: "send_as_gift",
            },
            deliveryTime: {
              type: "string",
              enum: ["immediately", "custom"],
              description: "Delivery time",
              example: "custom",
            },
            deliveryDate: {
              type: "string",
              format: "date",
              description: "Delivery date (required for custom delivery time)",
              example: "2025-12-25",
            },
            period: {
              type: "string",
              enum: ["morning", "afternoon", "evening"],
              description:
                "Delivery period (required for custom delivery time)",
              example: "afternoon",
            },
            issuedAt: {
              type: "string",
              format: "date-time",
              description: "Gift card issue timestamp",
            },
          },
        },
        Pagination: {
          type: "object",
          properties: {
            page: {
              type: "integer",
              description: "Current page number",
              example: 1,
            },
            limit: {
              type: "integer",
              description: "Items per page",
              example: 10,
            },
            total: {
              type: "integer",
              description: "Total number of items",
              example: 50,
            },
            totalPages: {
              type: "integer",
              description: "Total number of pages",
              example: 5,
            },
            hasNext: {
              type: "boolean",
              description: "Whether there is a next page",
              example: true,
            },
            hasPrev: {
              type: "boolean",
              description: "Whether there is a previous page",
              example: false,
            },
          },
        },
        User: {
          type: "object",
          required: ["id", "username", "email", "role"],
          properties: {
            id: {
              type: "string",
              format: "uuid",
              description: "User ID",
              example: "123e4567-e89b-12d3-a456-426614174000",
            },
            username: {
              type: "string",
              description: "Username",
              example: "admin",
            },
            email: {
              type: "string",
              format: "email",
              description: "User email address",
              example: "admin@example.com",
            },
            role: {
              type: "string",
              enum: ["admin", "user"],
              description: "User role",
              example: "admin",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "User creation timestamp",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            error: {
              type: "string",
              description: "Error message",
              example: "Brand not found",
            },
          },
        },
      },
    },
  },
  apis: ["./routes/*.js"], // paths to files containing OpenAPI definitions
};

const specs = swaggerJsdoc(options);

module.exports = {
  specs,
  swaggerUi,
};
