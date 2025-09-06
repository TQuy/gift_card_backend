import { Sequelize, DataTypes, Model } from "sequelize";
import { DeliveryPeriod, DeliveryTime, DeliveryType, GiftCardAttributes, GiftCardCreationAttributes } from "./types";

export const GIFT_CARD_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  USED: 'used',
  EXPIRED: 'expired'
} as const;

export const DELIVERY_TYPE = {
  PERSONAL: 'personal',
  SEND_AS_GIFT: 'send_as_gift'
} as const;

export const DELIVERY_TIME = {
  IMMEDIATELY: 'immediately',
  CUSTOM: 'custom'
} as const;

export const DELIVERY_PERIOD = {
  MORNING: 'morning',
  AFTERNOON: 'afternoon',
  EVENING: 'evening'
} as const;

// Define the GiftCard model class extending Sequelize Model
class GiftCardModel
  extends Model<GiftCardAttributes, GiftCardCreationAttributes>
  implements GiftCardAttributes {
  public id!: string;
  public brandId!: number;
  public brandName!: string;
  public amount!: number;
  public activationCode!: string;
  public senderName?: string;
  public recipientName?: string;
  public recipientEmail!: string;
  public recipientPhone!: string;
  public message?: string;
  public pin?: string;
  public deliveryType!: DeliveryType;
  public deliveryTime!: DeliveryTime;
  public deliveryDate?: string;
  public period?: DeliveryPeriod;
  public status!: string;
  public isUsed!: boolean;
  public usedAt?: Date;
  public readonly issuedAt?: Date;
  public readonly updatedAt?: Date;

  // Static properties for constants
  public static readonly GIFT_CARD_STATUS = GIFT_CARD_STATUS;
  public static readonly DELIVERY_TYPE = DELIVERY_TYPE;
  public static readonly DELIVERY_TIME = DELIVERY_TIME;
  public static readonly DELIVERY_PERIOD = DELIVERY_PERIOD;
}

export default function (sequelize: Sequelize) {
  GiftCardModel.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      brandId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'brands',
          key: 'id',
        },
      },
      brandName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: 0.01,
        },
      },
      activationCode: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      senderName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      recipientName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      recipientEmail: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      recipientPhone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: '',
      },
      pin: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      deliveryType: {
        type: DataTypes.ENUM(DELIVERY_TYPE.PERSONAL, DELIVERY_TYPE.SEND_AS_GIFT),
        allowNull: false,
        validate: {
          isIn: [Object.values(DELIVERY_TYPE)],
        },
      },
      deliveryTime: {
        type: DataTypes.ENUM(DELIVERY_TIME.IMMEDIATELY, DELIVERY_TIME.CUSTOM),
        allowNull: false,
        validate: {
          isIn: [Object.values(DELIVERY_TIME)],
        },
      },
      deliveryDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      period: {
        type: DataTypes.ENUM(DELIVERY_PERIOD.MORNING, DELIVERY_PERIOD.AFTERNOON, DELIVERY_PERIOD.EVENING),
        allowNull: true,
        validate: {
          isIn: [Object.values(DELIVERY_PERIOD)],
        },
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: GIFT_CARD_STATUS.ACTIVE,
        allowNull: false,
        validate: {
          isIn: [Object.values(GIFT_CARD_STATUS)],
        },
      },
      isUsed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      usedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'gift_cards',
      timestamps: true,
      modelName: 'GiftCard',
      createdAt: 'issuedAt',
      updatedAt: 'updatedAt',
    }
  );

  return GiftCardModel;
};
