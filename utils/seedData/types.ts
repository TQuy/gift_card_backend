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
  role_id: number;
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

export {
  BrandData,
  UserData,
  GiftCardData,
};
