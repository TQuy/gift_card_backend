import { BRAND_STATUS } from "@/models/Brand";

function getRandomProducts(): number {
  return Math.floor(Math.random() * 500) + 1;
}

// Import USER_ROLES constant
const USER_ROLES = { ADMIN: 1, USER: 2 } as const;

interface BrandData {
  name: string;
  description: string;
  logo: string;
  status: number;
  country: string;
  phoneNumber: string;
  company: string;
  products: number;
}

interface UserData {
  username: string;
  email: string;
  password: string;
  role: number;
}

interface GiftCardData {
  brandId: number;
  brandName: string;
  amount: number;
  activationCode: string;
  senderName: string;
  recipientName: string;
  recipientEmail: string;
  recipientPhone: string;
  message: string;
  deliveryType: string;
  deliveryTime: string;
  deliveryDate: string;
  period: string;
  status: string;
  isUsed: boolean;
  usedAt: Date | null;
}

const sampleBrands: BrandData[] = [
  {
    name: "Grab",
    description: "Southeast Asian super app",
    logo: "https://upload.wikimedia.org/wikipedia/en/1/12/Grab_%28application%29_logo.svg",
    status: BRAND_STATUS.ACTIVE,
    country: "Singapore",
    phoneNumber: "+65 6234 5678",
    company: "Grab Holdings Inc.",
    products: getRandomProducts(),
  },
  {
    name: "Amazon",
    description: "Global e-commerce and cloud computing",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    status: BRAND_STATUS.ACTIVE,
    country: "Global",
    phoneNumber: "+1 206 266 1000",
    company: "Amazon.com, Inc.",
    products: getRandomProducts(),
  },
  {
    name: "Esprit",
    description: "Fashion and lifestyle brand",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/49/Esprit.svg",
    status: BRAND_STATUS.ACTIVE,
    country: "Germany",
    phoneNumber: "+49 211 3006 0",
    company: "Esprit Holdings Limited",
    products: getRandomProducts(),
  },
  {
    name: "Subway",
    description: "Fast food restaurant chain",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Subway_2016_logo.svg",
    status: BRAND_STATUS.ACTIVE,
    country: "Global",
    phoneNumber: "+1 203 877 4281",
    company: "Subway Restaurants",
    products: getRandomProducts(),
  },
  {
    name: "Lazada",
    description: "Online shopping platform",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/4d/Lazada_%282019%29.svg",
    status: BRAND_STATUS.ACTIVE,
    country: "Singapore",
    phoneNumber: "+65 6123 4567",
    company: "Lazada Singapore Pte Ltd",
    products: getRandomProducts(),
  },
  {
    name: "Kaspersky",
    description: "Cybersecurity and antivirus provider",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/25/Kaspersky_logo.svg",
    status: BRAND_STATUS.ACTIVE,
    country: "Global",
    phoneNumber: "+7 495 797 8700",
    company: "Kaspersky Lab",
    products: getRandomProducts(),
  },
  {
    name: "Netflix",
    description: "Streaming entertainment service",
    logo: "https://logos-world.net/wp-content/uploads/2020/04/Netflix-Logo.png",
    status: BRAND_STATUS.ACTIVE,
    country: "Global",
    phoneNumber: "+1 866 579 7172",
    company: "Netflix, Inc.",
    products: getRandomProducts(),
  },
  {
    name: "Spotify",
    description: "Music streaming platform",
    logo: "https://upload.wikimedia.org/wikipedia/commons/8/84/Spotify_icon.svg",
    status: BRAND_STATUS.ACTIVE,
    country: "Global",
    phoneNumber: "+46 8 510 520 00",
    company: "Spotify AB",
    products: getRandomProducts(),
  },
  {
    name: "Netflix 2",
    description: "Streaming entertainment service",
    logo: "https://logos-world.net/wp-content/uploads/2020/04/Netflix-Logo.png",
    status: BRAND_STATUS.ACTIVE,
    country: "Global",
    phoneNumber: "+1 866 579 7172",
    company: "Netflix, Inc.",
    products: getRandomProducts(),
  },
  {
    name: "Spotify 2",
    description: "Music streaming platform",
    logo: "https://upload.wikimedia.org/wikipedia/commons/8/84/Spotify_icon.svg",
    status: BRAND_STATUS.ACTIVE,
    country: "Global",
    phoneNumber: "+46 8 510 520 00",
    company: "Spotify AB",
    products: getRandomProducts(),
  },
];

// Sample users
const sampleUsers: UserData[] = [
  {
    username: "admin",
    email: "admin@example.com",
    password: "1", // Will be hashed by the model hook
    role: USER_ROLES.ADMIN,
  },
];

function generateActivationCode(): string {
  return Math.random().toString(36).substring(2, 15).toUpperCase();
}

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
async function seedBrands(Brand: any, options: SeedOptions = {}): Promise<any[]> {
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
async function seedGiftCards(GiftCard: any, options: SeedOptions = {}): Promise<any[]> {
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

/**
 * Seed users into the database
 */
async function seedUsers(User: any, options: SeedOptions = {}): Promise<any[]> {
  const { force = false, ignoreDuplicates = true } = options;

  if (force) {
    await User.destroy({ where: {} });
  }

  const createdUsers = await User.bulkCreate(sampleUsers, {
    ignoreDuplicates,
    returning: true,
    individualHooks: true, // Important: enables password hashing hooks
  });

  return createdUsers;
}

interface SeedDatabaseModels {
  Brand: any;
  GiftCard: any;
  User?: any;
}

interface SeedDatabaseResult {
  brands: any[];
  giftCards: any[];
  users: any[];
}

/**
 * Seed both brands and gift cards
 */
export async function seedDatabase(models: SeedDatabaseModels, options: SeedOptions = {}): Promise<SeedDatabaseResult> {
  const { Brand, GiftCard, User } = models;
  const {
    brandsOnly = false,
    usersOnly = false,
    force = false,
    ignoreDuplicates = true,
  } = options;

  let createdBrands: any[] = [];
  let createdGiftCards: any[] = [];
  let createdUsers: any[] = [];

  // Seed users if User model is provided
  if (User) {
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
    users: createdUsers,
  };
}

/**
 * Check if database is empty (no brands)
 */
async function isDatabaseEmpty(Brand: any): Promise<boolean> {
  const brandCount = await Brand.count();
  return brandCount === 0;
}

export {
  sampleBrands,
  sampleUsers,
  generateActivationCode,
  generateSampleGiftCards,
  seedBrands,
  seedGiftCards,
  seedUsers,
  isDatabaseEmpty,
};
