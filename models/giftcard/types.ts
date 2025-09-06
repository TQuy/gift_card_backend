import { DELIVERY_PERIOD, DELIVERY_TIME, DELIVERY_TYPE } from "./GiftCard";

export interface GiftCardAttributes {
  id: string;
  brandId: number;
  brandName: string;
  amount: number;
  activationCode: string;
  senderName?: string;
  recipientName?: string;
  recipientEmail: string;
  recipientPhone: string;
  message?: string;
  pin?: string;
  deliveryType: 'personal' | 'send_as_gift';
  deliveryTime: 'immediately' | 'custom';
  deliveryDate?: string; // DATEONLY becomes string
  period?: 'morning' | 'afternoon' | 'evening';
  status: string;
  isUsed: boolean;
  usedAt?: Date;
  issuedAt?: Date; // createdAt
  updatedAt?: Date;
}

export interface GiftCardCreationAttributes {
  brandId: number;
  brandName: string;
  amount: number;
  activationCode: string;
  senderName?: string;
  recipientName?: string;
  recipientEmail: string;
  recipientPhone: string;
  message?: string;
  pin?: string;
  deliveryType: 'personal' | 'send_as_gift';
  deliveryTime: 'immediately' | 'custom';
  deliveryDate?: string;
  period?: 'morning' | 'afternoon' | 'evening';
  status?: string;
  isUsed?: boolean;
  usedAt?: Date;
}

export type DeliveryType = typeof DELIVERY_TYPE[keyof typeof DELIVERY_TYPE];
export type DeliveryTime = typeof DELIVERY_TIME[keyof typeof DELIVERY_TIME];
export type DeliveryPeriod = typeof DELIVERY_PERIOD[keyof typeof DELIVERY_PERIOD];