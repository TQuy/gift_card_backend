import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { initializeDatabase } from "@/models";
import { specs, swaggerUi } from "./swagger";
import router from "@/routes";
import { config } from "dotenv";
import { corsOptions } from "./config/constants";

config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(helmet());
app.use(cors(corsOptions));
app.use(morgan("combined"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", router);

// Swagger API Documentation
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    explorer: true,
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Gift Card API Documentation",
  })
);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Gift Card API is running" });
});

// 404 handler for unmatched routes
app.use((req: express.Request, res: express.Response) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

let server: any;

// Initialize database and start server
const startServer = async (): Promise<void> => {
  try {
    await initializeDatabase();
    console.log('Database initialized successfully');

    if (require.main === module) {
      // Only start server if this file is run directly, not when imported for tests
      server = app.listen(PORT, () => {
        console.log(`Gift Card API server is running on port ${PORT}`);
      });
    }
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

export { app, server };
