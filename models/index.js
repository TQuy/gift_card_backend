const { Sequelize } = require('sequelize');
const path = require('path');

// Database configuration
const isTest = process.env.NODE_ENV === 'test';
const dbPath = isTest 
  ? ':memory:' 
  : path.join(__dirname, '..', 'data', 'gift_cards.sqlite');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: isTest ? false : console.log, // Disable logging in tests
});

// Import models
const Brand = require('./Brand')(sequelize, Sequelize.DataTypes);
const GiftCard = require('./GiftCard')(sequelize, Sequelize.DataTypes);

// Define associations
Brand.hasMany(GiftCard, { foreignKey: 'brandId', as: 'giftCards' });
GiftCard.belongsTo(Brand, { foreignKey: 'brandId', as: 'brand' });

// Sync database and seed initial data
const initializeDatabase = async () => {
  try {
    await sequelize.sync({ force: isTest }); // Force sync in tests to reset data
    
    // Seed initial brands if not in test environment
    if (!isTest) {
      const brandCount = await Brand.count();
      if (brandCount === 0) {
        await Brand.bulkCreate([
          {
            name: "Lazada",
            description: "Online shopping platform",
            logo: "lazada-logo.png",
            isActive: true,
          },
          {
            name: "Grab",
            description: "Southeast Asian super app",
            logo: "grab-logo.png",
            isActive: true,
          },
          {
            name: "Amazon",
            description: "Global e-commerce and cloud computing",
            logo: "amazon-logo.png",
            isActive: true,
          },
          {
            name: "Subway",
            description: "Fast food restaurant chain",
            logo: "subway-logo.png",
            isActive: true,
          },
          {
            name: "Esprit",
            description: "Fashion and lifestyle brand",
            logo: "esprit-logo.png",
            isActive: true,
          },
        ]);
        console.log('Initial brands seeded successfully');
      }
    }
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
};

module.exports = {
  sequelize,
  Brand,
  GiftCard,
  initializeDatabase,
};
