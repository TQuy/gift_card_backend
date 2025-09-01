import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

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
            id: { type: "string", example: "123e4567-e89b-12d3-a456-426614174000" },
            username: { type: "string", example: "admin" },
            email: { type: "string", example: "admin@example.com" },
            role: { type: "string", example: "admin" },
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
