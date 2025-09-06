#!/usr/bin/env ts-node

import { initializeDatabase, Brand, GiftCard, sequelize } from "@/models";

async function truncateTables(): Promise<void> {
  try {
    console.log("🧹 Starting table truncation...");

    // Parse command line arguments
    const args = process.argv.slice(2);
    const keepBrands = args.includes("--keep-brands");
    const showHelp = args.includes("--help") || args.includes("-h");

    if (showHelp) {
      console.log(`
Usage: ts-node scripts/truncate-tables.ts [options]

Options:
  --keep-brands     Keep brands table, only truncate gift cards
  --help, -h        Show this help message

Examples:
  ts-node scripts/truncate-tables.ts                    # Truncate both tables
  ts-node scripts/truncate-tables.ts --keep-brands      # Keep brands, truncate gift cards only
`);
      process.exit(0);
    }

    // Initialize database connection
    await initializeDatabase();

    // Always truncate gift cards first (due to foreign key constraints)
    console.log("🗑️  Truncating gift cards table...");
    const giftCardCount = await GiftCard.count();
    await GiftCard.destroy({ where: {} });
    console.log(`✅ Deleted ${giftCardCount} gift cards`);

    if (!keepBrands) {
      console.log("🗑️  Truncating brands table...");
      const brandCount = await Brand.count();
      await Brand.destroy({ where: {} });
      console.log(`✅ Deleted ${brandCount} brands`);
    } else {
      console.log("📦 Keeping brands table (--keep-brands flag used)");
    }

    // Display final summary
    const remainingBrands = await Brand.count();
    const remainingGiftCards = await GiftCard.count();

    console.log("\n📊 Final Status:");
    console.log(`   Brands: ${remainingBrands}`);
    console.log(`   Gift Cards: ${remainingGiftCards}`);

    console.log("\n🎉 Table truncation completed successfully!");
  } catch (error) {
    console.error("❌ Error truncating tables:", error);
    process.exit(1);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

// Run the truncation
if (require.main === module) {
  truncateTables();
}
