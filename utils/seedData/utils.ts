import { BrandAttributes } from "@/models/brand/types";
import { GiftCardData } from "./types";

export function getRandomProducts(): number {
  return Math.floor(Math.random() * 500) + 1;
}

export function generateActivationCode(): string {
  return Math.random().toString(36).substring(2, 15).toUpperCase();
}

export function generateSampleGiftCards(brands: BrandAttributes[]): GiftCardData[] {
  const sampleCards: GiftCardData[] = [];

  brands.forEach((brand) => {
    // Generate 2-3 gift cards per brand
    for (let i = 0; i < Math.floor(Math.random() * 2) + 2; i++) {
      sampleCards.push({
        brandId: brand.id,
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