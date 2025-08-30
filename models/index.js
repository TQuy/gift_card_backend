const { Sequelize } = require("sequelize");
const path = require("path");
const { seedDatabase } = require("../utils/seedData");

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
const Brand = require("./Brand")(sequelize, Sequelize.DataTypes);
const GiftCard = require("./GiftCard")(sequelize, Sequelize.DataTypes);

// Define associations
Brand.hasMany(GiftCard, { foreignKey: "brandId", as: "giftCards" });
GiftCard.belongsTo(Brand, { foreignKey: "brandId", as: "brand" });

// Sync database tables only
const initializeDatabase = async () => {
  try {
    await sequelize.sync({ force: isTest }); // Force sync in tests to reset data
    console.log("Database tables synchronized successfully");
  } catch (error) {
    console.error("Database initialization failed:", error);
    throw error;
  }
};

// Initialize database and seed data for tests
const initializeTestDatabase = async () => {
  try {
    await initializeDatabase();
    await seedDatabase({ Brand, GiftCard }, { force: true });
    console.log("Test database seeded successfully");
  } catch (error) {
    console.error("Test database initialization failed:", error);
    throw error;
  }
};

module.exports = {
  sequelize,
  Brand,
  GiftCard,
  initializeDatabase,
  initializeTestDatabase,
};
