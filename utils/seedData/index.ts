import { USER_ROLES } from "@/models/role/Role";
import { sampleBrands, sampleUsers, sampleUserRoles } from "./sample";
import { generateSampleGiftCards } from "./utils";

interface SeedOptions {
  force?: boolean;
  ignoreDuplicates?: boolean;
  brandsOnly?: boolean;
  usersOnly?: boolean;
  count?: number;
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
  createdBrands: any[],
  options: SeedOptions = {}
): Promise<any[]> {
  const { force = false, ignoreDuplicates = true } = options;

  if (force) {
    await GiftCard.destroy({ where: {} });
  }

  const sampleGiftCards = generateSampleGiftCards(createdBrands);

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
async function seedUsers(User: any, createdRoles: any[], options: SeedOptions = {}): Promise<any[]> {
  const { force = false, ignoreDuplicates = true } = options;

  if (force) {
    await User.destroy({ where: {} });
  }

  const adminRole = createdRoles.find(i => {
    return i.name === USER_ROLES.ADMIN
  })
  const userRole = createdRoles.find(i => {
    return i.name === USER_ROLES.USER
  })
  for (const [idx, i] of sampleUsers.entries()) {
    if (idx === 0) {
      i.role_id = adminRole.id
    } else {
      i.role_id = userRole.id
    }
  }

  const createdUsers = await User.bulkCreate(sampleUsers, {
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
  if (createdRoles && User) {
    createdUsers = await seedUsers(User, createdRoles, { force, ignoreDuplicates });
  }

  // Seed brands unless usersOnly is true
  if (!usersOnly) {
    createdBrands = await seedBrands(Brand, { force, ignoreDuplicates });

    // Seed gift cards unless brandsOnly is true
    if (!brandsOnly) {
      createdGiftCards = await seedGiftCards(GiftCard, createdBrands, {
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

export { seedBrands, seedGiftCards, seedUsers };
