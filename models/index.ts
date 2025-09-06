import { Sequelize } from "sequelize";
import path from "path";
import { seedDatabase } from "@/utils/seedData";
// Import models
import BrandModel from "./brand/Brand";
import GiftCardModel from "./giftcard/GiftCard";
import UserModel from "./user/User";
import RoleModel from "./role/Role";

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

const Brand = BrandModel(sequelize);
const GiftCard = GiftCardModel(sequelize);
const User = UserModel(sequelize);
const Role = RoleModel(sequelize);

// Define associations by calling associate methods
const models = { Brand, GiftCard, User, Role };

// Call associate methods if they exist
Object.values(models).forEach((model: any) => {
  if (model.associate) {
    model.associate(models);
  }
});

// Define other associations that aren't in model files yet
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
    await seedDatabase({ Brand, GiftCard, Role, User }, { force: true });
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
  Role,
  initializeDatabase,
  initializeTestDatabase,
};
