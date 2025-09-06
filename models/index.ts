import { Sequelize, DataTypes } from "sequelize";
import path from "path";
import { seedDatabase } from "@/utils/seedData";

// Database configuration
const isTest = process.env.NODE_ENV === "test";
const dbPath = isTest
  ? ":memory:"
  : path.join(__dirname, "..", "data", "gift_cards.sqlite");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: dbPath,
  logging: isTest ? false : console.log, // Disable logging in tests
});

// Import models
import BrandModel from "./Brand";
import GiftCardModel from "./GiftCard";
import UserModel from "./User";

const Brand = BrandModel(sequelize);
const GiftCard = GiftCardModel(sequelize);
const User = UserModel(sequelize);

// Define associations
Brand.hasMany(GiftCard, { foreignKey: "brandId", as: "giftCards" });
GiftCard.belongsTo(Brand, { foreignKey: "brandId", as: "brand" });

// Sync database tables only
const initializeDatabase = async (): Promise<void> => {
  try {
    await sequelize.sync({ force: isTest }); // Force sync in tests to reset data
    console.log("Database tables synchronized successfully");
  } catch (error) {
    console.error("Database initialization failed:", error);
    throw error;
  }
};

// Initialize database and seed data for tests
const initializeTestDatabase = async (): Promise<void> => {
  try {
    await initializeDatabase();
    await seedDatabase({ Brand, GiftCard, User }, { force: true });
    console.log("Test database seeded successfully");
  } catch (error) {
    console.error("Test database initialization failed:", error);
    throw error;
  }
};

export {
  sequelize,
  Brand,
  GiftCard,
  User,
  initializeDatabase,
  initializeTestDatabase,
};
