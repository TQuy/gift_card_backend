#!/usr/bin/env ts-node

import { initializeDatabase, Brand, GiftCard, Role, User, sequelize } from "@/models";
import { seedDatabase } from "@/utils/seedData";

const populateDatabase = async (): Promise<void> => {
  try {
    console.log("🚀 Starting database population...");

    // Parse command line arguments
    const args = process.argv.slice(2);
    const shouldClearData = args.includes("--clear") || args.includes("-c");
    const shouldAddBrandsOnly = args.includes("--brands-only");
    const shouldAddUsersOnly = args.includes("--users-only");

    // Initialize database (sync tables)
    await initializeDatabase();

    // Use shared seeding logic
    const seedOptions = {
      force: shouldClearData,
      brandsOnly: shouldAddBrandsOnly,
      usersOnly: shouldAddUsersOnly,
      ignoreDuplicates: !shouldClearData,
    };

    if (shouldClearData) {
      console.log("🧹 Clearing existing data...");
    }

    let seedType = "brands, gift cards, and users";
    if (shouldAddBrandsOnly) {
      seedType = "brands only";
    } else if (shouldAddUsersOnly) {
      seedType = "users only";
    }

    console.log(`📄 Seeding database with ${seedType}...`);
    await seedDatabase({ Brand, GiftCard, Role, User }, seedOptions);

    console.log("✅ Database population completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Database population failed:", error);
    process.exit(1);
  } finally {
    // Close the database connection
    if (sequelize) {
      await sequelize.close();
    }
  }
};

// Only run if this file is executed directly
if (require.main === module) {
  populateDatabase();
}
