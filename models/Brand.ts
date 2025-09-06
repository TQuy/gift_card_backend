import { Sequelize, DataTypes } from "sequelize";

export const BRAND_STATUS = { ACTIVE: 1, INACTIVE: 0 } as const;

export default (sequelize: Sequelize): any => {
  const Brand = sequelize.define(
    "Brand",
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
        defaultValue: 1,
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
      tableName: "brands",
      timestamps: true,
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    }
  );

  (Brand as any).BRAND_STATUS = BRAND_STATUS;
  return Brand;
};
