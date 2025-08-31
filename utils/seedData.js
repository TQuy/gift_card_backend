function getRandomProducts() {
  return Math.floor(Math.random() * 500) + 1;
}

const sampleBrands = [
  {
    name: "Grab",
    description: "Southeast Asian super app",
    logo: "https://upload.wikimedia.org/wikipedia/en/1/12/Grab_%28application%29_logo.svg",
    isActive: true,
    country: "Singapore",
    phoneNumber: "+65 6234 5678",
    company: "Grab Holdings Inc.",
    products: getRandomProducts(),
  },
  {
    name: "Amazon",
    description: "Global e-commerce and cloud computing",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    isActive: true,
    country: "Global",
    phoneNumber: "+1 206 266 1000",
    company: "Amazon.com, Inc.",
    products: getRandomProducts(),
  },
  {
    name: "Esprit",
    description: "Fashion and lifestyle brand",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/49/Esprit.svg",
    isActive: true,
    country: "Germany",
    phoneNumber: "+49 211 3006 0",
    company: "Esprit Holdings Limited",
    products: getRandomProducts(),
  },
  {
    name: "Subway",
    description: "Fast food restaurant chain",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Subway_2016_logo.svg",
    isActive: true,
    country: "Global",
    phoneNumber: "+1 203 877 4281",
    company: "Subway Restaurants",
    products: getRandomProducts(),
  },
  {
    name: "Lazada",
    description: "Online shopping platform",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/4d/Lazada_%282019%29.svg",
    isActive: true,
    country: "Singapore",
    phoneNumber: "+65 6123 4567",
    company: "Lazada Singapore Pte Ltd",
    products: getRandomProducts(),
  },
  {
    name: "Kaspersky",
    description: "Cybersecurity and antivirus provider",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/25/Kaspersky_logo.svg",
    isActive: true,
    country: "Global",
    phoneNumber: "+7 495 797 8700",
    company: "Kaspersky Lab",
    products: getRandomProducts(),
  },
  {
    name: "Netflix",
    description: "Streaming entertainment service",
    logo: "https://logos-world.net/wp-content/uploads/2020/04/Netflix-Logo.png",
    isActive: true,
    country: "Global",
    phoneNumber: "+1 866 579 7172",
    company: "Netflix, Inc.",
    products: getRandomProducts(),
  },
  {
    name: "Spotify",
    description: "Music streaming platform",
    logo: "https://upload.wikimedia.org/wikipedia/commons/8/84/Spotify_icon.svg",
    isActive: true,
    country: "Global",
    phoneNumber: "+46 8 510 520 00",
    company: "Spotify AB",
    products: getRandomProducts(),
  },
];

function generateActivationCode() {
  return Math.random().toString(36).substring(2, 15).toUpperCase();
}

function generateSampleGiftCards(brands) {
  const sampleCards = [];

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
        recipientPhone: `+1${
          Math.floor(Math.random() * 9000000000) + 1000000000
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
 * @param {Object} Brand - Sequelize Brand model
 * @param {Object} options - Seeding options
 * @param {boolean} options.force - Whether to clear existing data
 * @param {boolean} options.ignoreDuplicates - Whether to ignore duplicate entries
 * @returns {Promise<Array>} Array of created brands
 */
async function seedBrands(Brand, options = {}) {
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
 * @param {Object} GiftCard - Sequelize GiftCard model
 * @param {Object} options - Seeding options
 * @param {boolean} options.force - Whether to clear existing data
 * @param {boolean} options.ignoreDuplicates - Whether to ignore duplicate entries
 * @param {number} options.count - Number of cards per brand (if not using random generation)
 * @returns {Promise<Array>} Array of created gift cards
 */
async function seedGiftCards(GiftCard, options = {}) {
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
 * Seed both brands and gift cards
 * @param {Object} models - Object containing Brand and GiftCard models
 * @param {Object} options - Seeding options
 * @returns {Promise<Object>} Object containing created brands and gift cards
 */
async function seedDatabase({ Brand, GiftCard }, options = {}) {
  const {
    brandsOnly = false,
    force = false,
    ignoreDuplicates = true,
  } = options;

  // Seed brands
  const createdBrands = await seedBrands(Brand, { force, ignoreDuplicates });

  let createdGiftCards = [];
  if (!brandsOnly) {
    // Seed gift cards
    createdGiftCards = await seedGiftCards(GiftCard, {
      force,
      ignoreDuplicates,
    });
  }

  return {
    brands: createdBrands,
    giftCards: createdGiftCards,
  };
}

/**
 * Check if database is empty (no brands)
 * @param {Object} Brand - Sequelize Brand model
 * @returns {Promise<boolean>} True if database is empty
 */
async function isDatabaseEmpty(Brand) {
  const brandCount = await Brand.count();
  return brandCount === 0;
}

module.exports = {
  sampleBrands,
  generateActivationCode,
  generateSampleGiftCards,
  seedBrands,
  seedGiftCards,
  seedDatabase,
  isDatabaseEmpty,
};
