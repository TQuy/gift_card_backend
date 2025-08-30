#!/usr/bin/env node

const { initializeDatabase, Brand, GiftCard, sequelize } = require("../models");
const { seedDatabase, isDatabaseEmpty } = require("../utils/seedData");

const populateDatabase = async () => {
  try {
    console.log("🚀 Starting database population...");

    // Parse command line arguments
    const args = process.argv.slice(2);
    const shouldClearData = args.includes("--clear") || args.includes("-c");
    const shouldAddBrandsOnly = args.includes("--brands-only");

    // Initialize database (sync tables)
    await initializeDatabase();

    // Use shared seeding logic
    const seedOptions = {
      force: shouldClearData,
      brandsOnly: shouldAddBrandsOnly,
      ignoreDuplicates: !shouldClearData,
    };

    if (shouldClearData) {
      console.log("🧹 Clearing existing data...");
    }

    console.log(
      `📦 Seeding ${
        shouldAddBrandsOnly ? "brands only" : "brands and gift cards"
      }...`
    );

    const result = await seedDatabase({ Brand, GiftCard }, seedOptions);

    console.log(`✅ Inserted ${result.brands.length} brands`);
    if (!shouldAddBrandsOnly) {
      console.log(`✅ Inserted ${result.giftCards.length} gift cards`);
    }

    // Display summary
    const brandCount = await Brand.count();
    const giftCardCount = await GiftCard.count();
    const usedCards = await GiftCard.count({ where: { isUsed: true } });

    console.log("\n📊 Database Population Summary:");
    console.log(`   Brands: ${brandCount}`);
    console.log(`   Gift Cards: ${giftCardCount}`);
    console.log(`   Used Cards: ${usedCards}`);
    console.log(`   Available Cards: ${giftCardCount - usedCards}`);

    console.log("\n🎉 Database populated successfully!");
  } catch (error) {
    console.error("❌ Error populating database:", error);
    process.exit(1);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
};

// Add command line options
const args = process.argv.slice(2);

if (args.includes("--help") || args.includes("-h")) {
  console.log(`
Usage: node scripts/populate-database.js [options]

Options:
  --clear, -c       Clear existing data before populating
  --brands-only     Only populate brands, skip gift cards
  --help, -h        Show this help message

Examples:
  node scripts/populate-database.js                    # Populate with sample data
  node scripts/populate-database.js --clear           # Clear and populate
  node scripts/populate-database.js --brands-only     # Only add brands
`);
  process.exit(0);
}

// Run the population
populateDatabase();
