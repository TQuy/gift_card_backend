import { Sequelize, DataTypes, Model } from "sequelize";
import { BrandAttributes, BrandCreationAttributes } from "./types";

export const BRAND_STATUS = { ACTIVE: 1, INACTIVE: 0 } as const;

// Define the Brand model class extending Sequelize Model
class BrandModel
  extends Model<BrandAttributes, BrandCreationAttributes>
  implements BrandAttributes {
  public id!: number;
  public name!: string;
  public description!: string;
  public logo!: string;
  public status!: number;
  public country!: string;
  public phoneNumber!: string;
  public company!: string;
  public products!: number;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;

  // Static property for constants
  public static readonly BRAND_STATUS = BRAND_STATUS;
}

export default function (sequelize: Sequelize) {
  BrandModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: "",
      },
      logo: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "",
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: BRAND_STATUS.ACTIVE,
        validate: {
          isIn: [Object.values(BRAND_STATUS)],
        },
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Singapore",
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "+123 4455 6677 8899",
      },
      company: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "XYZ Limited",
      },
      products: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      tableName: "brands",
      timestamps: true,
      modelName: "Brand",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return BrandModel;
}
