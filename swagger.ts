import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { sampleUser } from "./utils/seedData/sample";
import { USER_ROLES } from "./models/role/Role";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Gift Card API",
      version: "1.0.0",
      description: "A REST API for managing gift card brands and issuing gift cards",
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
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "token",
          description: "JWT token stored in HTTP-only cookie",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            username: { type: "string", example: sampleUser.username },
            email: { type: "string", example: sampleUser.password },
            role_id: { type: "integer", example: 1 },
            roleName: { type: "string", example: USER_ROLES.ADMIN },
            isAdmin: { type: "boolean", example: true },
            createdAt: { type: "string", format: "date-time", example: "2024-01-01T00:00:00.000Z" },
          },
        },
        Error: {
          type: "object",
          properties: {
            error: { type: "string", example: "Error message" },
          },
        },
      },
    },
  },
  // Scan TypeScript route files for @swagger comments
  apis: ["./routes/*.ts"],
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUi };
