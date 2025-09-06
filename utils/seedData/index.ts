import { sampleBrands, sampleUser, sampleUserRoles } from "./sample";
import {
  BrandData,
  GiftCardData,
} from "./types";
import { generateActivationCode } from "./utils";

interface SeedOptions {
  force?: boolean;
  ignoreDuplicates?: boolean;
  brandsOnly?: boolean;
  usersOnly?: boolean;
  count?: number;
}

function generateSampleGiftCards(brands: BrandData[]): GiftCardData[] {
  const sampleCards: GiftCardData[] = [];

  brands.forEach((brand, index) => {
    // Generate 2-3 gift cards per brand
    for (let i = 0; i < Math.floor(Math.random() * 2) + 2; i++) {
      sampleCards.push({
        brandId: index + 1, // Assuming auto-increment starts at 1
        brandName: brand.name,
        amount: [25.0, 50.0, 100.0, 200.0][Math.floor(Math.random() * 4)],
        activationCode: generateActivationCode(),
        senderName: ["John Doe", "Jane Smith", "Alice Johnson", "Bob Wilson"][
          Math.floor(Math.random() * 4)
        ],
        recipientName: [
          "Mike Brown",
          "Sarah Davis",
          "Tom Miller",
          "Lisa Garcia",
        ][Math.floor(Math.random() * 4)],
        recipientEmail: `recipient${Math.floor(
          Math.random() * 1000
        )}@example.com`,
        recipientPhone: `+1${Math.floor(Math.random() * 9000000000) + 1000000000
          }`,
        message: [
          "Happy Birthday!",
          "Congratulations!",
          "Enjoy your gift!",
          "From your friend",
        ][Math.floor(Math.random() * 4)],
        deliveryType: ["personal", "send_as_gift"][
          Math.floor(Math.random() * 2)
        ],
        deliveryTime: ["immediately", "custom"][Math.floor(Math.random() * 2)],
        deliveryDate: new Date(
          Date.now() + Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
        )
          .toISOString()
          .split("T")[0],
        period: ["morning", "afternoon", "evening"][
          Math.floor(Math.random() * 3)
        ],
        status: "active",
        isUsed: Math.random() < 0.3, // 30% chance of being used
        usedAt: Math.random() < 0.3 ? new Date() : null,
      });
    }
  });

  return sampleCards;
}

/**
 * Seed brands into the database
 */
async function seedBrands(
  Brand: any,
  options: SeedOptions = {}
): Promise<any[]> {
  const { force = false, ignoreDuplicates = true } = options;

  if (force) {
    await Brand.destroy({ where: {} });
  }

  const createdBrands = await Brand.bulkCreate(sampleBrands, {
    ignoreDuplicates,
    returning: true,
  });

  return createdBrands;
}

/**
 * Seed gift cards into the database
 */
async function seedGiftCards(
  GiftCard: any,
  options: SeedOptions = {}
): Promise<any[]> {
  const { force = false, ignoreDuplicates = true } = options;

  if (force) {
    await GiftCard.destroy({ where: {} });
  }

  const sampleGiftCards = generateSampleGiftCards(sampleBrands);

  const createdGiftCards = await GiftCard.bulkCreate(sampleGiftCards, {
    ignoreDuplicates,
    returning: true,
  });

  return createdGiftCards;
}

async function seedRoles(Role: any, options: SeedOptions = {}): Promise<any[]> {
  const { force = false, ignoreDuplicates = true } = options;

  if (force) {
    await Role.destroy({ where: {} });
  }

  const createdRoles = await Role.bulkCreate(sampleUserRoles, {
    ignoreDuplicates,
    returning: true,
  });

  return createdRoles;
}

/**
 * Seed users into the database
 */
async function seedUsers(User: any, options: SeedOptions = {}): Promise<any[]> {
  const { force = false, ignoreDuplicates = true } = options;

  if (force) {
    await User.destroy({ where: {} });
  }

  const createdUsers = await User.bulkCreate(sampleUser, {
    ignoreDuplicates,
    returning: true,
    individualHooks: true, // Important: enables password hashing hooks
  });

  return createdUsers;
}

/**
 * Seed both brands and gift cards
 */
export async function seedDatabase(
  models: {
    Brand: any;
    GiftCard: any;
    Role?: any;
    User?: any;
  },
  options: SeedOptions = {}
): Promise<{
  brands: any[];
  giftCards: any[];
  users: any[];
  roles: any[];
}> {
  const { Brand, GiftCard, Role, User } = models;
  const {
    brandsOnly = false,
    usersOnly = false,
    force = false,
    ignoreDuplicates = true,
  } = options;

  let createdBrands: any[] = [];
  let createdGiftCards: any[] = [];
  let createdRoles: any[] = [];
  let createdUsers: any[] = [];

  if (Role) {
    createdRoles = await seedRoles(Role, { force, ignoreDuplicates });
  }

  // Seed users if User model is provided
  if (Role && User) {
    createdUsers = await seedUsers(User, { force, ignoreDuplicates });
  }

  // Seed brands unless usersOnly is true
  if (!usersOnly) {
    createdBrands = await seedBrands(Brand, { force, ignoreDuplicates });

    // Seed gift cards unless brandsOnly is true
    if (!brandsOnly) {
      createdGiftCards = await seedGiftCards(GiftCard, {
        force,
        ignoreDuplicates,
      });
    }
  }

  return {
    brands: createdBrands,
    giftCards: createdGiftCards,
    roles: createdRoles,
    users: createdUsers,
  };
}

export { generateSampleGiftCards, seedBrands, seedGiftCards, seedUsers };
